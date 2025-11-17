import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { BrigadaService } from '../core/services/brigada.service';
import { Herramienta, HerramientaService } from '../core/services/herramienta.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface UsuarioAuth {
  id: string;
  nro_documento: string;
  nombre: string;
  apellido: string;
  rol: string;
}

@Component({
  selector: 'app-gestionar-brigadas',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './gestionar-brigadas.html',
  styleUrls: ['./gestionar-brigadas.scss']
})
export class GestionarBrigadas implements OnInit {
  brigadas: any[] = [];
  cargando = true;
  error = '';

  auxiliares: UsuarioAuth[] = [];
  herramientas: Herramienta[] = [];

  selectedBrigada: any | null = null;
  auxiliarSeleccionado = '';
  herramientaSeleccionada = '';

  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';

  constructor(
    private brigadaService: BrigadaService,
    private herramientaService: HerramientaService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cargarBrigadas();
    this.cargarAuxiliares();
    this.cargarHerramientas();
  }

  cargarBrigadas(): void {
    this.cargando = true;
    this.brigadaService.listarBrigadas().subscribe({
      next: (brigadas) => {
        this.brigadas = brigadas;
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error cargando brigadas:', err);
        this.error = 'No se pudieron cargar las brigadas. Intenta nuevamente más tarde.';
        this.cargando = false;
      }
    });
  }

  cargarAuxiliares(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('⚠ No hay token disponible para cargar auxiliares.');
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${environment.apiAuthUrl}/api/auth/usuarios`;
    this.http.get<UsuarioAuth[]>(url, { headers }).subscribe({
      next: (usuarios) => {
        this.auxiliares = usuarios.filter(
          (usuario) => usuario.rol?.toLowerCase() === 'auxiliar de campo'
        );
      },
      error: (err) => {
        console.error('❌ Error cargando auxiliares:', err);
      }
    });
  }

  cargarHerramientas(): void {
    this.herramientaService.listar().subscribe({
      next: (herramientas) => {
        this.herramientas = herramientas;
      },
      error: (err) => {
        console.error('❌ Error cargando herramientas:', err);
      }
    });
  }

  abrirGestion(brigada: any): void {
    this.selectedBrigada = brigada;
    this.auxiliarSeleccionado = '';
    this.herramientaSeleccionada = '';
    this.mensaje = '';
    this.tipoMensaje = '';
  }

  cerrarGestion(): void {
    this.selectedBrigada = null;
    this.mensaje = '';
    this.tipoMensaje = '';
  }

  agregarAuxiliar(): void {
    if (!this.selectedBrigada || !this.auxiliarSeleccionado) {
      this.mostrarMensaje('Debes seleccionar un auxiliar de campo.', 'error');
      return;
    }

    const idBrigada = Number(this.selectedBrigada.id_brigada);
    const idAuxiliar = Number(this.auxiliarSeleccionado);

    this.brigadaService.agregarAuxiliar(idBrigada, idAuxiliar).subscribe({
      next: () => {
        this.mostrarMensaje('Auxiliar agregado a la brigada correctamente.', 'exito');
        this.auxiliarSeleccionado = '';
      },
      error: (err) => {
        console.error('❌ Error agregando auxiliar:', err);
        this.mostrarMensaje('No fue posible agregar el auxiliar. Intenta nuevamente.', 'error');
      }
    });
  }

  agregarHerramienta(): void {
    if (!this.selectedBrigada || !this.herramientaSeleccionada) {
      this.mostrarMensaje('Debes seleccionar una herramienta.', 'error');
      return;
    }

    const idBrigada = Number(this.selectedBrigada.id_brigada);
    const idHerramienta = Number(this.herramientaSeleccionada);

    this.brigadaService.agregarHerramienta(idBrigada, idHerramienta).subscribe({
      next: () => {
        this.mostrarMensaje('Herramienta agregada a la brigada correctamente.', 'exito');
        this.herramientaSeleccionada = '';
      },
      error: (err) => {
        console.error('❌ Error agregando herramienta:', err);
        this.mostrarMensaje('No fue posible agregar la herramienta. Intenta nuevamente.', 'error');
      }
    });
  }

  private mostrarMensaje(texto: string, tipo: 'exito' | 'error'): void {
    this.mensaje = texto;
    this.tipoMensaje = tipo;
    setTimeout(() => {
      this.mensaje = '';
      this.tipoMensaje = '';
    }, 4000);
  }
}
