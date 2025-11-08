import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

interface Conglomerado {
  id_conglomerado: number;
  codigo: string;
  lat: number;
  lng: number;
  estado: string;
  id_brigada?: number | null;
}

@Component({
  selector: 'app-listar-conglomerados',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './listar-conglomerados.html',
  styleUrls: ['./listar-conglomerados.scss']
})
export class ListarConglomerados implements OnInit {
  conglomerados: Conglomerado[] = [];
  cargando = true;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Reemplaza con el token real si es necesario

    });
    this.http.get<Conglomerado[]>('http://localhost:4002/api/conglomerados', { headers })
      .subscribe({
        next: (data) => {
          console.log('Conglomerados cargados:', data);
          this.conglomerados = data;
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar los conglomerados:', error);
          this.cargando = false;
        }
      });
  }
}
