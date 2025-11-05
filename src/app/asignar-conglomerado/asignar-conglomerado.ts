import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-asignar-conglomerado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Navbar],
  templateUrl: './asignar-conglomerado.html',
  styleUrls: ['./asignar-conglomerado.scss']
})
export class AsignarConglomerado implements OnInit {
  asignacionForm!: FormGroup;

  brigadas = [
    { id_brigada: 3, nombre: 'Brigada Norte' },
    { id_brigada: 4, nombre: 'Brigada Sur' }
  ];

  conglomerados = [
    { id_conglomerado: 9, codigo: 'CONG-243328-1546e3' },
    { id_conglomerado: 15, codigo: 'CONG-505152-490cf6' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.asignacionForm = this.fb.group({
      id_brigada: ['', Validators.required],
      id_conglomerado: ['', Validators.required],
      fecha_asignacion: [{ value: new Date().toISOString().slice(0, 10), disabled: true }]
    });
  }

  onSubmit() {
    if (this.asignacionForm.valid) {
      const formData = {
        id_brigada: this.asignacionForm.get('id_brigada')?.value,
        id_conglomerado: this.asignacionForm.get('id_conglomerado')?.value,
        fecha_asignacion: new Date().toISOString().slice(0, 10)
      };

      console.log('📦 Enviando asignación:', formData);
      alert(`✅ Conglomerado asignado correctamente a la brigada seleccionada.`);

      this.asignacionForm.reset({
        fecha_asignacion: new Date().toISOString().slice(0, 10)
      });
    }
  }
}
