import { Component, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ConglomeradoDetalle,
  ConglomeradoMapa,
  ConglomeradoService,
} from '../core/services/conglomerado.service';
import { Subparcela, SubparcelaService } from '../core/services/subparcela.service';
import { Navbar } from '../navbar/navbar';
import { Auditoria, AuditoriaService } from '../core/services/auditoria.service';

// Leaflet se carga dinámicamente para no romper SSR
let L: any;

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.scss'],
})
export class Inicio implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private conglomeradoService = inject(ConglomeradoService);
  private subparcelaService = inject(SubparcelaService);
  private auditoriaService = inject(AuditoriaService);

  private map!: any;
  private markers: any[] = [];
  private subparcelasLayers: any[] = [];

  isBrowser = false;
  private leafletLoaded = false;

  selectedConglomerado: ConglomeradoDetalle | null = null;
  selectedSubparcelas: Subparcela[] = [];
  subparcelasResumen: { categoria: string; total: number }[] = [];
  infoCargando = false;
  infoError = '';

  historial: Auditoria[] = [];
  historialCargando = false;
  historialError = '';

  async ngAfterViewInit(): Promise<void> {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (!this.isBrowser) return;

    // Cargar Leaflet sólo en navegador
    const leaflet = await import('leaflet');
    L = leaflet;
    this.leafletLoaded = true;

    this.inicializarMapa();
    this.cargarConglomerados();
    this.cargarHistorial();
  }

  // --------------------------------------------------------
  // Mapa
  // --------------------------------------------------------
  inicializarMapa() {
    this.map = L.map('map', {
      zoomControl: false,
      zoomAnimation: true,
      minZoom: 4,
      maxZoom: 18,
    }).setView([4.5709, -74.2973], 6);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(
      this.map
    );

    setTimeout(() => this.map.invalidateSize(), 150);
  }

  // --------------------------------------------------------
  // Conglomerados
  // --------------------------------------------------------
  cargarConglomerados() {
    this.conglomeradoService.listarMapa().subscribe({
      next: (data) => this.colocarConglomerados(data),
      error: (err) => console.error('Error cargando conglomerados:', err),
    });
  }

  colocarConglomerados(data: ConglomeradoMapa[]) {
    if (!this.leafletLoaded) {
      return;
    }

    const icon = L.icon({
      iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    data.forEach((c) => {
      const lat = Number(c.lat);
      const lng = Number(c.lng);
      if (!isFinite(lat) || !isFinite(lng)) return;

      const marker = L.marker([lat, lng], { icon }).addTo(this.map);

      marker.bindTooltip(
        `<b>${c.codigo}</b><br>
         Estado: ${c.estado}`,
        { className: 'tooltip-bosque', direction: 'top' }
      );

      marker.on('mouseover', () => marker.openTooltip());
      marker.on('mouseout', () => marker.closeTooltip());

      marker.on('click', () => {
        this.zoomCinematico(lat, lng);
        this.mostrarDetalleConglomerado(c);
        this.cargarSubparcelas(c.id_conglomerado);
      });

      this.markers.push(marker);
    });
  }

  private mostrarDetalleConglomerado(marcador: ConglomeradoMapa) {
    this.infoError = '';
    this.infoCargando = false;
    this.selectedConglomerado = this.mapearDesdeMarcador(marcador);
  }

  // --------------------------------------------------------
  // Subparcelas
  // --------------------------------------------------------
  private cargarSubparcelas(id_conglomerado: number) {
    this.limpiarSubparcelas();
    this.selectedSubparcelas = [];
    this.subparcelasResumen = [];

    this.subparcelaService.listarPorConglomerado(id_conglomerado).subscribe({
      next: (subps) => {
        this.selectedSubparcelas = subps;
        this.actualizarResumenSubparcelas();
        this.dibujarSubparcelas(subps);
      },
      error: (err) => {
        console.error('Error subparcelas:', err);
      },
    });
  }

  private dibujarSubparcelas(subps: Subparcela[]) {
    if (!this.leafletLoaded) {
      return;
    }

    const colores: Record<string, string> = {
      brinzales: '#1b5e20',
      latizales: '#43a047',
      fustales: '#66bb6a',
      'fustales grandes': '#a5d6a7',
      fustales_grandes: '#a5d6a7',
    };

    subps.forEach((sp) => {
      const lat = Number(sp.centro_lat);
      const lng = Number(sp.centro_lng ?? sp.centro_lon);
      if (!isFinite(lat) || !isFinite(lng)) return;

      const radio = Number(sp.radio);

      const circle = L.circle([lat, lng], {
        radius: radio,
        color: colores[sp.categoria] || '#4caf50',
        fillColor: colores[sp.categoria] || '#4caf50',
        fillOpacity: 0.35,
        weight: 2,
      }).addTo(this.map);

      circle.bindTooltip(`<b>${sp.categoria}</b><br>Radio: ${sp.radio} m`, {
        className: 'tooltip-bosque',
        direction: 'top',
      });

      circle.bindPopup(
        `<b>Subparcela #${sp.id_subparcela}</b><br>
        Categoría: ${sp.categoria}<br>
        Radio: ${sp.radio} m<br>
        Área: ${sp.area ?? 'N/A'}`
      );

      this.subparcelasLayers.push(circle);
    });
  }

  private limpiarSubparcelas() {
    this.subparcelasLayers.forEach((layer) => {
      try {
        layer.remove();
      } catch (e) {
        // ignorar
      }
    });
    this.subparcelasLayers = [];
  }

  private actualizarResumenSubparcelas() {
    const resumen = new Map<string, number>();
    this.selectedSubparcelas.forEach((sp) => {
      const categoria = sp.categoria || 'Sin categoría';
      resumen.set(categoria, (resumen.get(categoria) ?? 0) + 1);
    });

    this.subparcelasResumen = Array.from(resumen.entries()).map(([categoria, total]) => ({
      categoria,
      total,
    }));
  }

  // --------------------------------------------------------
  // Historial
  // --------------------------------------------------------
  private cargarHistorial() {
    this.historialCargando = true;
    this.historialError = '';

    this.auditoriaService.obtenerRecientes().subscribe({
      next: (data) => {
        this.historial = data;
      },
      error: (err) => {
        console.error('Error cargando historial:', err);
        this.historialError = 'No se pudo cargar el historial reciente.';
        this.historial = [];
        this.historialCargando = false;
      },
      complete: () => {
        this.historialCargando = false;
      },
    });
  }

  // --------------------------------------------------------
  // Zoom cinemático
  // --------------------------------------------------------
  zoomCinematico(lat: number, lng: number) {
    this.map.flyTo([lat, lng], 18, {
      animate: true,
      duration: 2.5,
      easeLinearity: 0.15,
    });
  }

  private mapearDesdeMarcador(marcador: ConglomeradoMapa): ConglomeradoDetalle {
    const lat = Number(marcador.lat);
    const lng = Number(marcador.lng);
    const datos: any = marcador;
    const ubicacion = datos.ubicacion ?? {};

    return {
      id_conglomerado: marcador.id_conglomerado,
      codigo: marcador.codigo,
      estado: marcador.estado,
      fecha_inicio: marcador.fecha_inicio,
      fecha_fin: marcador.fecha_fin,
      ubicacion: {
        lat: ubicacion.lat ?? lat,
        lng: ubicacion.lng ?? lng,
        region: ubicacion.region ?? datos.region ?? datos.departamento,
        departamento: ubicacion.departamento ?? datos.departamento,
      },
      departamento: datos.departamento,
      municipio: datos.municipio,
      vereda: datos.vereda,
    };
  }
}
