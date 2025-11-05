import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { BrigadaService } from '../core/services/brigada.service';
import { HttpClient } from '@angular/common/http';

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

  // 🔹 Cargar conglomerados desde el backend
  cargarConglomerados(): void {
    this.http.get<any[]>('http://localhost:3001/api/conglomerados/listar').subscribe({
      next: (res: any[]) => {
        this.conglomerados = res;
      },
      error: (err: any) => {
        console.error('❌ Error cargando conglomerados:', err);
        alert('Error al cargar conglomerados.');
      }
    });
  }

  // 🔹 Cargar líderes desde el backend (usuarios con rol jefe)
  cargarLideres(): void {
    this.http.get<any[]>('http://localhost:3001/api/usuarios/listar').subscribe({
      next: (res: any[]) => {
        this.lideres = res.filter((u: any) => u.rol === 'jefe');
      },
      error: (err: any) => {
        console.error('❌ Error cargando líderes:', err);
        alert('Error al cargar líderes.');
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
