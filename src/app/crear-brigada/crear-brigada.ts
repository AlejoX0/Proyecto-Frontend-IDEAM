import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { BrigadaService } from '../core/services/brigada.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-crear-brigada',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Navbar],
  templateUrl: './crear-brigada.html',
  styleUrls: ['./crear-brigada.scss']
})
export class CrearBrigada implements OnInit {
  brigadaForm!: FormGroup;
  conglomerados: any[] = [];
  lideres: any[] = [];
  departamentos: string[] = [
    'Antioquia', 'Boyacá', 'Caldas', 'Cauca', 'Cundinamarca',
    'Huila', 'Nariño', 'Santander', 'Tolima', 'Valle del Cauca'
  ];

  constructor(
    private fb: FormBuilder,
    private brigadaService: BrigadaService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.brigadaForm = this.fb.group({
      nombre_brigada: ['', Validators.required],
      departamento: ['', Validators.required],
      id_conglomerado: ['', Validators.required],
      lider: ['', Validators.required],
      fecha_asignacion: [new Date().toISOString().split('T')[0]]
    });

    this.cargarConglomerados();
    this.cargarLideres();
  }

  // 🔹 Cargar conglomerados desde el microservicio 4002
  cargarConglomerados(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('⚠ No hay token de autenticación. Inicia sesión primero.');
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>('http://localhost:4002/api/conglomerados', { headers }).subscribe({
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
      alert('⚠ No hay token de autenticación. Inicia sesión primero.');
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>('http://localhost:3001/api/auth/usuarios', { headers }).subscribe({
      next: (res) => {
        this.lideres = res.filter(
          (u: any) =>
            u.rol &&
            (u.rol.toLowerCase() === 'jefe' || u.rol.toLowerCase() === 'jefe de brigada')
        );
        console.log('✅ Líderes cargados:', this.lideres);
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
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    const data = {
      ...this.brigadaForm.getRawValue(),
      fecha_asignacion: new Date(this.brigadaForm.get('fecha_asignacion')?.value).toISOString().split('T')[0]
    };

    console.log("📤 Enviando datos de brigada:", data);

    this.brigadaService.crearBrigada(data).subscribe({
      next: () => {
        alert(`✅ Brigada "${data.nombre_brigada}" creada correctamente.`);
        this.brigadaForm.reset({
          fecha_asignacion: new Date().toISOString().split('T')[0]
        });
      },
      error: (err) => {
        console.error('❌ Error al crear brigada:', err);
        alert('Error al crear la brigada (ver consola).');
      }
    });
  }
}