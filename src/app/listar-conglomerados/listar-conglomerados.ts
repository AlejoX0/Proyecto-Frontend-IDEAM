// Imports actualizados
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { FormsModule } from '@angular/forms'; // 👈 ¡IMPORTANTE! Añadir esto

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
  // 👇 ¡IMPORTANTE! Añadir FormsModule aquí
  imports: [CommonModule, Navbar, FormsModule], 
  templateUrl: './listar-conglomerados.html',
  styleUrls: ['./listar-conglomerados.scss']
})
export class ListarConglomerados implements OnInit {
  
  // --- Listas de datos ---
  conglomerados: Conglomerado[] = []; // Lista maestra original
  conglomeradosFiltrados: Conglomerado[] = []; // Lista que se muestra

  // --- Estados ---
  cargando = true;

  // --- Listas para filtros <select> ---
  estadosUnicos: string[] = [];
  
  // --- Objeto para valores de filtros ---
  filtros = {
    id: '',
    codigo: '',
    estado: '', // Valor inicial para "Todos"
    brigada: ''
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    this.http.get<Conglomerado[]>('http://localhost:4002/api/conglomerados', { headers })
      .subscribe({
        next: (data) => {
          console.log('Conglomerados cargados:', data);
          
          this.conglomerados = data; // Guardamos en la lista maestra
          this.conglomeradosFiltrados = data; // Inicialmente, la lista filtrada es igual
          
          // 1. Extraemos los estados únicos para el filtro
          this.extraerValoresUnicos(data); 
          
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar los conglomerados:', error);
          this.cargando = false;
        }
      });
  }

  // --- NUEVA FUNCIÓN: Extrae valores únicos para los <select> ---
  extraerValoresUnicos(data: Conglomerado[]): void {
    const estados = new Set(data.map(c => c.estado).filter(Boolean));
    this.estadosUnicos = [...estados];
  }

  // --- NUEVA FUNCIÓN: Se llama cada vez que un filtro cambia ---
  aplicarFiltros(): void {
    // 1. Empezamos con la lista maestra completa
    let conglomTemp = [...this.conglomerados];
    
    const filtroId = this.filtros.id.trim();
    const filtroCodigo = this.filtros.codigo.trim().toLowerCase();
    const filtroEstado = this.filtros.estado;
    const filtroBrigada = this.filtros.brigada.trim();

    // 2. Aplicamos filtros si tienen valor
    if (filtroId) {
      conglomTemp = conglomTemp.filter(c => 
        c.id_conglomerado.toString().includes(filtroId)
      );
    }

    if (filtroCodigo) {
      conglomTemp = conglomTemp.filter(c => 
        c.codigo.toLowerCase().includes(filtroCodigo)
      );
    }

    if (filtroEstado) {
      conglomTemp = conglomTemp.filter(c => 
        c.estado === filtroEstado
      );
    }

    if (filtroBrigada) {
      conglomTemp = conglomTemp.filter(c => 
        c.id_brigada?.toString().includes(filtroBrigada)
      );
    }

    // 6. Actualizamos la tabla
    this.conglomeradosFiltrados = conglomTemp;
  }

  // --- NUEVA FUNCIÓN: Limpia todos los filtros ---
  limpiarFiltros(): void {
    this.filtros = {
      id: '',
      codigo: '',
      estado: '',
      brigada: ''
    };
    this.aplicarFiltros(); // Re-aplicamos (mostrará todos)
  }
}