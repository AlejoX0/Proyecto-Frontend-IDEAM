import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar'; // usa tu clase Navbar real

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
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [''],
      rol: ['', Validators.required],
      username: [{ value: '', disabled: true }],
      passwordTemporal: [{ value: '', disabled: true }],
      fechaRegistro: [{ value: new Date().toLocaleDateString(), disabled: true }],
      estado: [{ value: 'Activo', disabled: true }]
    });
  }

  generarDatos() {
    const nombres = this.usuarioForm.get('nombres')?.value?.toLowerCase()?.replace(/\s+/g, '');
    const apellidos = this.usuarioForm.get('apellidos')?.value?.toLowerCase()?.replace(/\s+/g, '');
    const username = `${nombres}.${apellidos}`;
    const passwordTemporal = Math.random().toString(36).substring(2, 10);
    this.usuarioForm.patchValue({ username, passwordTemporal });
  }

  onSubmit() {
    if (this.usuarioForm.valid) {
      const data = this.usuarioForm.getRawValue();
      console.log('Usuario registrado:', data);
      alert(`✅ Usuario ${data.username} creado correctamente`);
      this.usuarioForm.reset();
    }
  }
}
