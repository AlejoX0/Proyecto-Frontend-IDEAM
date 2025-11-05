import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ConglomeradoService, Conglomerado } from '../core/services/conglomerado.service';

@Component({
  selector: 'app-crear-conglomerado-manual',
  standalone: true,
  imports: [CommonModule, Navbar, ReactiveFormsModule],
  templateUrl: './crear-conglomerado-manual.html',
  styleUrls: ['./crear-conglomerado-manual.scss']
})
export class CrearConglomeradoManual implements OnInit {
  conglomeradoForm!: FormGroup;

  constructor(private fb: FormBuilder, private service: ConglomeradoService) {}

  ngOnInit(): void {
    this.conglomeradoForm = this.fb.group({
      nombre: ['', Validators.required],
      departamento: ['', Validators.required],
      municipio: ['', Validators.required],
      vereda: ['', Validators.required],
      coordenadas: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.conglomeradoForm.invalid) return;

    const data = this.conglomeradoForm.getRawValue() as Conglomerado;

    this.service.crearManual(data).subscribe({
      next: (res) => {
        alert('✅ Conglomerado creado correctamente');
        console.log('Nuevo conglomerado:', res);
        this.conglomeradoForm.reset();
      },
      error: (err) => {
        console.error('Error al crear conglomerado:', err);
        alert('❌ No se pudo crear el conglomerado');
      },
    });
  }
}
