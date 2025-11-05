import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Navbar],
  templateUrl: './crear-usuario.html',
  styleUrls: ['./crear-usuario.scss']
})
export class CrearUsuario {
  usuarioForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.usuarioForm = this.fb.group({
      nro_documento: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [''],
      password: [{ value: '', disabled: true }],
      rol: ['auxiliar de campo', Validators.required],
      departamento: ['']
    });
  }

  // Genera una contraseña automática y la muestra en el formulario
  generarPassword() {
    const password = Math.random().toString(36).slice(-8);
    this.usuarioForm.patchValue({ password });
  }

  // Se ejecuta al enviar el formulario
  onSubmit() {
    if (this.usuarioForm.valid) {
      const data = this.usuarioForm.getRawValue();

      // Si no se generó contraseña, crear una automáticamente
      if (!data.password) {
        data.password = Math.random().toString(36).slice(-8);
      }

      console.log('👤 Usuario registrado:', data);
      alert(`✅ Usuario ${data.nombre} ${data.apellido} creado correctamente`);

      this.usuarioForm.reset({
        rol: 'auxiliar de campo'
      });
    } else {
      alert('⚠️ Por favor complete todos los campos obligatorios.');
    }
  }
}
