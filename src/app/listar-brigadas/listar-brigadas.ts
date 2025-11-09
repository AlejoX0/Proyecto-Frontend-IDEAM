import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  apiUrl = 'http://localhost:4002/api/brigadas'; // 👈 usa el puerto correcto de tu backend

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarBrigadas();
  }

  cargarBrigadas(): void {
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