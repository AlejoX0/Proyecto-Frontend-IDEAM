import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

declare const google: any;

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.scss']
})
export class Inicio implements AfterViewInit {

  ngAfterViewInit() {
    this.cargarGoogleMaps().then(() => {
      this.inicializarMapa();
    });
  }

  // Cargar script de Google Maps
  cargarGoogleMaps(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).google) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyApWOGS5pzQI_PnIusKmSxKMHJhhd30LIo';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

  inicializarMapa() {

    // Tema oscuro para el mapa
    const darkStyle = [
      { elementType: "geometry", stylers: [{ color: "#1d1d1d" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#1d1d1d" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#8bc34a" }] },
      {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [{ color: "#4d4d4d" }]
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#003300" }]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#0a2342" }]
      }
    ];

    const mapa = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 4.5709, lng: -74.2973 },
      zoom: 6,
      styles: darkStyle
    });

    // 🔥 Conglomerados simulados de bosques en Colombia
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

    // Ícono verde tipo forestal
    const iconoBosque = {
      url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
    };

    // Agregar marcadores simulados
    conglomerados.forEach(c => {
      new google.maps.Marker({
        position: { lat: c.lat, lng: c.lng },
        map: mapa,
        title: c.nombre,
        icon: iconoBosque
      });
    });

    /*
      📌 AQUÍ IRÁ LA CONEXIÓN REAL CON TU BASE DE DATOS
      -------------------------------------------------
      En un próximo paso haremos:

      1. Crear un servicio Angular: ConglomeradoService
      2. Llamar a tu API backend (GET /conglomerados)
      3. Reemplazar "conglomerados" (simulados) con los datos de BD
      4. Añadir marcadores dinámicos al mapa según la respuesta

      Ejemplo futuro:
      this.conglomeradoService.obtenerConglomerados().subscribe(data => {
        data.forEach(c => new google.maps.Marker(...));
      });
    */
  }
}
