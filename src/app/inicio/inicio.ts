import {
  Component,
  AfterViewInit,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ConglomeradoService, ConglomeradoMapa } from '../core/services/conglomerado.service';
import { SubparcelaService, Subparcela } from '../core/services/subparcela.service';
import { Navbar } from '../navbar/navbar';

// Leaflet se carga dinámicamente → no romper SSR
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

  private map!: any;
  private markers: any[] = [];
  private subparcelasLayers: any[] = [];

  isBrowser = false;
  private leafletLoaded = false;

  async ngAfterViewInit(): Promise<void> {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (!this.isBrowser) return;

    // ⭐ Cargar Leaflet sólo en navegador
    const leaflet = await import('leaflet');
    L = leaflet;
    this.leafletLoaded = true;

    this.inicializarMapa();
    this.cargarConglomerados();
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

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { maxZoom: 18 }
    ).addTo(this.map);

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

        // ⭐ cargar subparcelas del conglomerado
        this.cargarSubparcelas(c.id_conglomerado);
      });

      this.markers.push(marker);
    });
  }

  // --------------------------------------------------------
  // Subparcelas
  // --------------------------------------------------------
  cargarSubparcelas(id_conglomerado: number) {
    // limpiar subparcelas previas
    this.subparcelasLayers.forEach(layer => {
      try { layer.remove(); } catch (e) { }
    });
    this.subparcelasLayers = [];

    this.subparcelaService.listarPorConglomerado(id_conglomerado).subscribe({
      next: (subps) => this.pintarSubparcelas(subps),
      error: (err) => console.error('Error subparcelas:', err),
    });
  }

  pintarSubparcelas(subps: Subparcela[]) {
    const colores: Record<string, string> = {
      'brinzales': '#1b5e20',
      'latizales': '#43a047',
      'fustales': '#66bb6a',
      'fustales grandes': '#a5d6a7',
    };

    subps.forEach((sp) => {
      const lat = Number(sp.centro_lat);
      const lng = Number(sp.centro_lng);
      if (!isFinite(lat) || !isFinite(lng)) return;

      const radio = Number(sp.radio);

      const circle = L.circle([lat, lng], {
        radius: radio,
        color: colores[sp.categoria] || '#4caf50',
        fillColor: colores[sp.categoria] || '#4caf50',
        fillOpacity: 0.35,
        weight: 2,
      }).addTo(this.map);

      circle.bindTooltip(
        `<b>${sp.categoria}</b><br>Radio: ${sp.radio} m`,
        { className: 'tooltip-bosque', direction: 'top' }
      );

      circle.bindPopup(`
        <b>Subparcela #${sp.id_subparcela}</b><br>
        Categoría: ${sp.categoria}<br>
        Radio: ${sp.radio} m<br>
        Área: ${sp.area ?? 'N/A'}
      `);

      this.subparcelasLayers.push(circle);
    });
  }

  // --------------------------------------------------------
  // Zoom cinematográfico
  // --------------------------------------------------------
  zoomCinematico(lat: number, lng: number) {
    this.map.flyTo([lat, lng], 18, {
      animate: true,
      duration: 2.5,
      easeLinearity: 0.15,
    });
  }
}
