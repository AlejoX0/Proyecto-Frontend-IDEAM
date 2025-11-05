import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

interface Conglomerado {
  id_conglomerado: number;
  codigo: string;
  departamento: string;
  municipio: string;
  latitud: number;
  longitud: number;
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

  ngOnInit(): void {
    // 🔹 Simulación de datos (más adelante se reemplaza con HttpClient)
    setTimeout(() => {
      this.conglomerados = [
        {
          id_conglomerado: 1,
          codigo: 'CONG-2025-001',
          departamento: 'Santander',
          municipio: 'Bucaramanga',
          latitud: 7.1254,
          longitud: -73.1198,
          estado: 'Activo',
          id_brigada: 3
        },
        {
          id_conglomerado: 2,
          codigo: 'CONG-2025-002',
          departamento: 'Boyacá',
          municipio: 'Tunja',
          latitud: 5.5443,
          longitud: -73.3576,
          estado: 'Muestreado',
          id_brigada: null
        }
      ];
      this.cargando = false;
    }, 700);
  }
}
