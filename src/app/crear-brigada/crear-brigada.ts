import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Navbar } from '../navbar/navbar'; // Asegúrate de que Navbar esté en los imports del componente si es necesario
import { Brigada, BrigadaService } from '../core/services/brigada.service';
import { Conglomerado, ConglomeradoService } from '../core/services/conglomerado.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Definimos una interfaz para el usuario que esperamos del endpoint de autenticación
interface UsuarioAuth {
  id: string;
  nro_documento: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;
}

@Component({
  selector: 'app-crear-brigada',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Navbar],
  templateUrl: './crear-brigada.html',
  styleUrls: ['./crear-brigada.scss']
})
export class CrearBrigada implements OnInit {
  brigadaForm!: FormGroup;
  conglomerados: Conglomerado[] = [];
  lideres: UsuarioAuth[] = [];
  departamentos: string[] = [
    'Antioquia', 'Boyacá', 'Caldas', 'Cauca', 'Cundinamarca',
    'Huila', 'Nariño', 'Santander', 'Tolima', 'Valle del Cauca'
  ];

  constructor(
    private fb: FormBuilder,
    private brigadaService: BrigadaService,
    private conglomeradoService: ConglomeradoService,
    private http: HttpClient // Inyectamos HttpClient para hacer la llamada directa
  ) {}

  ngOnInit(): void {
    this.brigadaForm = this.fb.group({
      departamento: [null, Validators.required],
      id_conglomerado: [null, Validators.required],
      lider: [null, Validators.required],
      fecha_asignacion: [new Date().toISOString().split('T')[0], Validators.required]
    });

    this.cargarConglomerados();
    this.cargarLideres();
  }

  // 🔹 Cargar conglomerados desde el microservicio 4002
  cargarConglomerados(): void {
    this.conglomeradoService.listar().subscribe({
      next: (res) => {
        this.conglomerados = res;
        console.log('✅ Conglomerados cargados:', res);
      },
      error: (err) => {
        console.error('❌ Error cargando conglomerados:', err);
        alert('Error al cargar conglomerados (ver consola).');
      }
    });
  }

  // 🔹 Cargar jefes de brigada desde Auth Service (3001)
  cargarLideres(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No se encontró token de autenticación. Por favor, inicie sesión.');
      return;
    }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // Apuntamos directamente al endpoint de autenticación que lista todos los usuarios
    this.http.get<UsuarioAuth[]>('http://localhost:3001/api/auth/usuarios', { headers }).subscribe({
      next: (res) => {
        // Filtramos para obtener solo los usuarios con roles de liderazgo
        this.lideres = res.filter(u =>
          u.rol && ['jefe', 'jefe de brigada', 'lider'].includes(u.rol.toLowerCase())
        );
        console.log('✅ Líderes cargados y filtrados:', this.lideres);
        if (this.lideres.length === 0) {
          console.warn('⚠️ No se encontraron usuarios con rol de líder.');
        }
      },
      error: (err) => {
        console.error('❌ Error cargando líderes:', err);
        alert('Error al cargar líderes (ver consola).');
      }
    });
  }

  // 🔹 Crear brigada
  onSubmit(): void {
    if (this.brigadaForm.invalid) {
      this.brigadaForm.markAllAsTouched();
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    const formValue = this.brigadaForm.getRawValue();

    const data: Brigada = {
      departamento: formValue.departamento,
      id_conglomerado: formValue.id_conglomerado ? Number(formValue.id_conglomerado) : null,
      lider: formValue.lider ? Number(formValue.lider) : 0, // Convertimos el nro_documento (string) a number
      fecha_asignacion: new Date(formValue.fecha_asignacion).toISOString().split('T')[0]
    };

    // Validación extra antes de enviar
    if (data.lider === null || Number.isNaN(data.lider)) {
      alert('Debes seleccionar un líder válido.');
      return;
    }

    console.log("📤 Enviando datos de brigada:", data);

    this.brigadaService.crearBrigada(data as Brigada).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        // Asumimos que la respuesta es el objeto de la brigada creada
        const newId = response?.id_brigada;
        alert(`✅ Brigada creada correctamente${newId ? ' (id: ' + newId + ')' : ''}.`);
        this.brigadaForm.reset({
          id_conglomerado: null,
          lider: null,
          departamento: null,
          fecha_asignacion: new Date().toISOString().split('T')[0]
        });
      },
      error: (err) => {
        console.error('❌ Error al crear brigada:', err);
        const msg = err?.error?.error || err?.error?.message || err.message || 'Error al crear la brigada (ver consola).';
        alert(`Error al crear la brigada: ${msg}`);
      }
    });
  }
}
