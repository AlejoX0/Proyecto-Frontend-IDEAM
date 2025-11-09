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

  constructor(
    private fb: FormBuilder,
    private brigadaService: BrigadaService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.brigadaForm = this.fb.group({
      nombre: ['', Validators.required],
      id_conglomerado: ['', Validators.required],
      lider: ['', Validators.required],
      fecha_asignacion: [{ value: new Date().toISOString().split('T')[0], disabled: true }]
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

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  // ✅ Confirmado: esta es la ruta correcta
  this.http.get<any[]>('http://localhost:4002/api/conglomerados', { headers }).subscribe({
    next: (res: any[]) => {
      this.conglomerados = res;
      console.log('✅ Conglomerados cargados:', res);
    },
    error: (err: any) => {
      console.error('❌ Error cargando conglomerados:', err);
      alert('Error al cargar conglomerados (ver consola para detalles).');
    }
  });
}

  // 🔹 Cargar jefes de brigada desde el Auth Service (3001)
  cargarLideres(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('⚠ No hay token de autenticación. Inicia sesión primero.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // ✅ FIX 3: Ruta correcta en auth-service/routes/authRoutes.js → /api/auth/usuarios
    this.http.get<any[]>('http://localhost:3001/api/auth/usuarios', { headers }).subscribe({
      next: (res: any[]) => {
        // ✅ Filtramos por "jefe" o "jefe de brigada"
        this.lideres = res.filter(
          (u: any) =>
            u.rol &&
            (u.rol.toLowerCase() === 'jefe' || u.rol.toLowerCase() === 'jefe de brigada')
        );
        console.log('✅ Líderes cargados:', this.lideres);
      },
      error: (err: any) => {
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
      fecha_asignacion: new Date().toISOString().split('T')[0]
    };

    this.brigadaService.crearBrigada(data).subscribe({
      next: () => {
        alert(`✅ Brigada "${data.nombre}" creada correctamente.`);
        this.brigadaForm.reset({
          fecha_asignacion: new Date().toISOString().split('T')[0]
        });
      },
      error: (err: any) => {
        console.error('❌ Error al crear brigada:', err);
        alert('Error al crear la brigada.');
      }
    });
  }
}