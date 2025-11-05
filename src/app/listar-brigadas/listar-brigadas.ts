import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

interface Brigada {
  id_brigada: number;
  nombre: string;
  jefe: string;
  region: string;
  fecha_creacion: string;
  id_conglomerado?: number | null;
}

@Component({
  selector: 'app-listar-brigadas',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './listar-brigadas.html',
  styleUrls: ['./listar-brigadas.scss']
})
export class ListarBrigadas implements OnInit {
  brigadas: Brigada[] = [];
  cargando = true;

  ngOnInit(): void {
    // 🔹 Simulación de carga (luego se reemplazará por servicio HttpClient)
    setTimeout(() => {
      this.brigadas = [
        {
          id_brigada: 1,
          nombre: 'Brigada Norte',
          jefe: 'Carlos Ramírez',
          region: 'Andina',
          fecha_creacion: '2025-10-02',
          id_conglomerado: 9
        },
        {
          id_brigada: 2,
          nombre: 'Brigada Sur',
          jefe: 'Ana Gómez',
          region: 'Caribe',
          fecha_creacion: '2025-10-10',
          id_conglomerado: null
        }
      ];
      this.cargando = false;
    }, 800);
  }
}
