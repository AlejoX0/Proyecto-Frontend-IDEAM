import {
  Component,
  AfterViewInit,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as L from 'leaflet';

import {
  ConglomeradoService,
  ConglomeradoMapa
} from '../core/services/conglomerado.service';

import { Navbar } from '../navbar/navbar';

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

  private map!: L.Map;
  private markers: L.Marker[] = [];
  
  isBrowser = false;

  ngAfterViewInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.inicializarMapa();
      this.cargarConglomerados();
    }
  }

  // --------------------------------------------------------
  // 1️⃣ Inicializar el mapa
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
  }

  // --------------------------------------------------------
  // 2️⃣ Cargar conglomerados desde el backend
  // --------------------------------------------------------
  cargarConglomerados() {
    this.conglomeradoService.listarMapa().subscribe({
      next: (data: ConglomeradoMapa[]) => {
        this.colocarConglomerados(data);
      },
      error: (err) => console.error('Error cargando conglomerados:', err),
    });
  }

  // --------------------------------------------------------
  // 3️⃣ Colocar marcadores de conglomerados
  // --------------------------------------------------------
  colocarConglomerados(data: ConglomeradoMapa[]) {
    const icon = L.icon({
      iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    data.forEach((c) => {
      const marker = L.marker([c.lat, c.lng], { icon }).addTo(this.map);

      marker.bindTooltip(
        `
        <b>${c.codigo}</b><br>
        Estado: ${c.estado}<br>
        Inicio: ${c.fecha_inicio ?? 'N/A'}<br>
        Fin: ${c.fecha_fin ?? 'N/A'}
        `
      );

      marker.on('mouseover', () => marker.openTooltip());

      marker.on('click', () => {
        this.zoomCinematico(c.lat, c.lng);
      });

      this.markers.push(marker);
    });
  }

  // --------------------------------------------------------
  // 4️⃣ Zoom cinematográfico
  // --------------------------------------------------------
  zoomCinematico(lat: number, lng: number) {
    this.map.flyTo([lat, lng], 16, {
      animate: true,
      duration: 2.5,
      easeLinearity: 0.15,
    });
  }
}
