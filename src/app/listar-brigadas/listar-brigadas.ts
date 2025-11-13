// Debes importar FormsModule y ReactiveFormsModule para que [(ngModel)] funcione
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // 👈 ¡IMPORTANTE! Añadir esto

@Component({
  selector: 'app-listar-brigadas',
  standalone: true,
  // 👇 ¡IMPORTANTE! Añadir FormsModule aquí
  imports: [CommonModule, Navbar, FormsModule], 
  templateUrl: './listar-brigadas.html',
  styleUrls: ['./listar-brigadas.scss']
})
export class ListarBrigadas implements OnInit {
  
  // --- Variables de estado ---
  brigadas: any[] = []; // Lista maestra original
  brigadasFiltradas: any[] = []; // Lista que se muestra en la tabla
  cargando = true;
  apiUrl = 'http://localhost:4001/api/brigadas';

  // --- Listas para los filtros desplegables ---
  departamentosUnicos: string[] = [];
  
  // --- Objeto para guardar los valores de los filtros ---
  filtros = {
    id: '',
    departamento: '', // Valor inicial para "Todos"
    fecha: '',
    conglomerado: ''
  };

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarBrigadas();
    } else {
      this.cargando = false;
    }
  }

  cargarBrigadas(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: (res) => {
        console.log('✅ Brigadas cargadas:', res);
        this.brigadas = res; // Guardamos en la lista maestra
        this.brigadasFiltradas = res; // Inicialmente, la lista filtrada es igual
        
        // 1. Extraemos los departamentos únicos para el filtro
        this.extraerValoresUnicos(res); 
        
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error cargando brigadas:', err);
        this.cargando = false;
      }
    });
  }

  // --- NUEVA FUNCIÓN: Extrae valores únicos para los <select> ---
  extraerValoresUnicos(brigadas: any[]): void {
    // Usamos Set para obtener valores únicos automáticamente
    const deptos = new Set(brigadas.map(b => b.departamento).filter(Boolean)); // filter(Boolean) elimina nulos/undefined
    this.departamentosUnicos = [...deptos];
  }

  // --- NUEVA FUNCIÓN: Se llama cada vez que un filtro cambia ---
  aplicarFiltros(): void {
    // 1. Empezamos con la lista maestra completa
    let brigadasTemp = [...this.brigadas];

    // 2. Filtramos por ID (convertimos a string para usar .includes())
    if (this.filtros.id) {
      brigadasTemp = brigadasTemp.filter(b => 
        b.id_brigada.toString().includes(this.filtros.id)
      );
    }

    // 3. Filtramos por Departamento (si hay un valor seleccionado)
    if (this.filtros.departamento) {
      brigadasTemp = brigadasTemp.filter(b => 
        b.departamento === this.filtros.departamento
      );
    }

    // 4. Filtramos por Fecha (comparamos si la fecha del input está incluida en el string de fecha)
    if (this.filtros.fecha) {
      brigadasTemp = brigadasTemp.filter(b => 
        b.fecha_asignacion && b.fecha_asignacion.includes(this.filtros.fecha)
      );
    }

    // 5. Filtramos por Conglomerado (convertimos a string por si es null)
    if (this.filtros.conglomerado) {
      brigadasTemp = brigadasTemp.filter(b => 
        b.id_conglomerado?.toString().includes(this.filtros.conglomerado)
      );
    }

    // 6. Actualizamos la tabla
    this.brigadasFiltradas = brigadasTemp;
  }

  // --- NUEVA FUNCIÓN: Limpia todos los filtros ---
  limpiarFiltros(): void {
    this.filtros = {
      id: '',
      departamento: '',
      fecha: '',
      conglomerado: ''
    };
    this.aplicarFiltros(); // Re-aplicamos (mostrará todos)
  }
}