import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-listar-brigadas',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './listar-brigadas.html',
  styleUrls: ['./listar-brigadas.scss']
})
export class ListarBrigadas implements OnInit {
  brigadas: any[] = [];
  cargando = true;
  apiUrl = 'http://localhost:4001/api/brigadas'; // 👈 usa el puerto correcto de tu backend

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarBrigadas();
    } else {
      this.cargando = false; // En el servidor, no cargamos brigadas y detenemos el indicador de carga.
    }
  }

  cargarBrigadas(): void {
    // Esta función ahora solo se llamará en el navegador.
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: (res) => {
        console.log('✅ Brigadas cargadas:', res);
        this.brigadas = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error cargando brigadas:', err);
        this.cargando = false;
      }
    });
  }
}