import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.scss']
})
export class Inicio implements AfterViewInit {

  private map: any;
  private L: any;
  private circle: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Cargar Leaflet dinámicamente para no romper SSR
    this.L = await import('leaflet');

    this.inicializarMapa();
    this.mostrarConglomerados();
  }

  inicializarMapa() {
    const contenedor = document.getElementById('map');
    if (!contenedor) return;

    this.map = this.L.map(contenedor, {
      zoomControl: true,
      zoomAnimation: true,
      markerZoomAnimation: true,
      fadeAnimation: true
    }).setView([4.5709, -74.2973], 6);

    // Capa de mapa
    this.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);
  }

  mostrarConglomerados() {
    const conglomerados = [
      { lat: 1.253, lng: -77.287, nombre: "Bosque Alto Andino - Nariño" },
      { lat: 2.441, lng: -76.606, nombre: "Reserva Natural Munchique" },
      { lat: 4.437, lng: -75.200, nombre: "Bosque de Nieblas del Quindío" },
      { lat: 5.068, lng: -74.003, nombre: "Parque Natural Chingaza" },
      { lat: 6.998, lng: -73.055, nombre: "Bosques de Yariguíes" },
      { lat: 0.523, lng: -72.392, nombre: "Amazonía Colombiana - Putumayo" },
      { lat: 3.120, lng: -70.230, nombre: "Selva del Guaviare" },
      { lat: 7.090, lng: -70.761, nombre: "Bosques del Vichada" }
    ];

    const icono = this.L.icon({
      iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    conglomerados.forEach(c => {
      const marker = this.L.marker([c.lat, c.lng], { icon: icono }).addTo(this.map);

      // Tooltip al pasar mouse
      marker.bindTooltip(`<b>${c.nombre}</b>`, {
        permanent: false,
        direction: 'top',
        offset: [0, -15],
        className: 'tooltip-bosque'
      });

      // Click con zoom cinematográfico
      marker.on('click', () =>
        this.enfocarConglomerado(c.lat, c.lng, c.nombre, marker)
      );
    });
  }

  enfocarConglomerado(lat: number, lng: number, nombre: string, marker: any) {

    // Eliminar círculo anterior
    if (this.circle) {
      this.map.removeLayer(this.circle);
    }

    // Crear círculo pero agregarlo más tarde para el efecto cinematográfico
    this.circle = this.L.circle([lat, lng], {
      color: '#007f00',
      fillColor: '#39ff14',
      fillOpacity: 0.25,
      radius: 80
    });

    // 🌟 Zoom cinematográfico estilo dron
    this.map.flyTo([lat, lng], 17, {
      animate: true,
      duration: 4.5,        // Lento y suave
      easeLinearity: 0.08,  // Curva suave
      noMoveStart: false
    });

    // 🎥 El círculo aparece 1.2s después para efecto "enfoque"
    setTimeout(() => {
      this.circle.addTo(this.map);
    }, 1200);

    // 🎥 Popup después del enfoque (más cinemático)
    setTimeout(() => {
      marker.bindPopup(`<b>${nombre}</b>`).openPopup();
    }, 1800);
  }
}
