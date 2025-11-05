import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

interface Subparcela {
  id_subparcela: number;
  id_conglomerado: number;
  categoria: string;
  radio: number;
}

@Component({
  selector: 'app-listar-subparcelas',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './listar-subparcelas.html',
  styleUrls: ['./listar-subparcelas.scss']
})
export class ListarSubparcelas implements OnInit {
  // ✅ Variables que causaban el error
  subparcelas: Subparcela[] = [];
  cargando: boolean = true;

  ngOnInit(): void {
    // 🔹 Datos simulados por ahora (los traerás del backend luego)
    setTimeout(() => {
      this.subparcelas = [
        { id_subparcela: 1, id_conglomerado: 8, categoria: 'Fustales grandes', radio: 15 },
        { id_subparcela: 2, id_conglomerado: 8, categoria: 'Latizales', radio: 3 },
        { id_subparcela: 3, id_conglomerado: 8, categoria: 'Brinzales', radio: 1.5 },
        { id_subparcela: 4, id_conglomerado: 9, categoria: 'Fustales', radio: 7 },
      ];
      this.cargando = false;
    }, 1000);
  }
}
