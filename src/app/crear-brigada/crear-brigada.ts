import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-crear-brigada',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Navbar],
  templateUrl: './crear-brigada.html',
  styleUrls: ['./crear-brigada.scss']
})
export class CrearBrigada {
  brigadaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.brigadaForm = this.fb.group({
      nombre: ['', Validators.required],
      jefe: ['', Validators.required],
      region: ['', Validators.required],
      codigo: [{ value: this.generarCodigo(), disabled: true }],
      fechaCreacion: [{ value: new Date().toLocaleDateString(), disabled: true }]
    });
  }

  generarCodigo(): string {
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `BRG-${random}`;
  }

  onSubmit() {
    if (this.brigadaForm.valid) {
      const data = this.brigadaForm.getRawValue();
      console.log('Brigada registrada:', data);
      alert(`✅ Brigada ${data.nombre} creada correctamente.`);
      this.brigadaForm.reset({
        codigo: this.generarCodigo(),
        fechaCreacion: new Date().toLocaleDateString()
      });
    }
  }
}
