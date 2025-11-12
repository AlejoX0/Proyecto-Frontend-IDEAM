import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { SubparcelaService, Subparcela } from '../core/services/subparcela.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; // 1. Importar FormsModule

@Component({
  selector: 'app-listar-subparcelas',
  standalone: true,
  imports: [
    CommonModule, 
    Navbar, 
    FormsModule // 2. Añadirlo a los imports
  ],
  templateUrl: './listar-subparcelas.html',
  styleUrls: ['./listar-subparcelas.scss']
})
export class ListarSubparcelas implements OnInit {

  // --- Listas de datos ---
  subparcelas: Subparcela[] = []; 
  subparcelasMaestra: Subparcela[] = []; 
  
  // --- Estados de la UI ---
  cargando = true;
  error: string | null = null;

  // --- Propiedades para los filtros desplegables ---
  filtroConglomerado: string = ''; // Guarda el ID del conglomerado seleccionado
  filtroCategoria: string = ''; // Guarda la categoría seleccionada

  conglomeradosUnicos: number[] = [];
  categoriasUnicas: string[] = [];

  constructor(
    private subparcelaService: SubparcelaService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.cargando = true;
    this.error = null;
    const param = this.route.snapshot.paramMap.get('id_conglomerado');

    if (param) {
      // Carga por conglomerado (lógica anterior)
      const idConglomerado = Number(param);
      this.subparcelaService.listarPorConglomerado(idConglomerado).subscribe({
        next: (data: Subparcela[]) => {
          this.subparcelasMaestra = data || [];
          this.subparcelas = data || [];
          this.extraerFiltrosUnicos(); // Extrae filtros de esta lista
          this.cargando = false;
        },
        error: (err: any) => {
          this.error = err?.error?.message || 'Error al cargar subparcelas';
          this.cargando = false;
        }
      });
    } else {
      // Carga TODAS (lógica nueva)
      this.subparcelaService.listarTodas().subscribe({
        next: (data: Subparcela[]) => {
          this.subparcelasMaestra = data || [];
          this.subparcelas = data || [];
          this.extraerFiltrosUnicos(); // Extrae filtros de la lista completa
          this.cargando = false;
        },
        error: (err: any) => {
          this.error = err?.error?.message || 'Error al cargar subparcelas';
          this.cargando = false;
        }
      });
    }
  }

  /**
   * Extrae valores únicos de la lista maestra
   * para llenar los dropdowns de filtro.
   */
  extraerFiltrosUnicos(): void {
    // Saca categorías únicas
    const categorias = this.subparcelasMaestra.map(sp => sp.categoria);
    this.categoriasUnicas = [...new Set(categorias)].sort();

    // Saca conglomerados únicos
    const conglomerados = this.subparcelasMaestra.map(sp => sp.id_conglomerado);
    this.conglomeradosUnicos = [...new Set(conglomerados)].sort((a, b) => a - b);
  }

  /**
   * Lógica de filtrado combinada para los dropdowns.
   * Se ejecuta cada vez que un <select> cambia.
   */
  aplicarFiltros(): void {
    let subparcelasFiltradas = this.subparcelasMaestra;

    // 1. Filtrar por Conglomerado
    if (this.filtroConglomerado) {
      subparcelasFiltradas = subparcelasFiltradas.filter(sp => 
        sp.id_conglomerado === Number(this.filtroConglomerado)
      );
    }

    // 2. Filtrar por Categoría
    if (this.filtroCategoria) {
      subparcelasFiltradas = subparcelasFiltradas.filter(sp => 
        sp.categoria === this.filtroCategoria
      );
    }

    this.subparcelas = subparcelasFiltradas;
  }

  /**
   * Limpia los filtros y restaura la tabla.
   */
  limpiarFiltros(): void {
    this.filtroCategoria = '';
    this.filtroConglomerado = '';
    this.subparcelas = this.subparcelasMaestra;
  }
}