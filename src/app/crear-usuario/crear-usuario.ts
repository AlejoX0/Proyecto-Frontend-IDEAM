import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { UsuarioService } from '../core/services/usuario.service';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Navbar],
  templateUrl: './crear-usuario.html',
  styleUrls: ['./crear-usuario.scss']
})
export class CrearUsuario {
  usuarioForm: FormGroup;
  private usuarioService = inject(UsuarioService);
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder) {
    this.usuarioForm = this.fb.group({
      nro_documento: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [''],
      password: ['', [Validators.required]],
      rol: ['auxiliar de campo', Validators.required],
      departamento: ['']
    });
  }

  // Se ejecuta al enviar el formulario
  async onSubmit() {
    if (this.usuarioForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      
      const formValue = this.usuarioForm.getRawValue();

      // Validación mínima: no enviar si la contraseña está vacía
      if (!formValue.password || String(formValue.password).trim() === '') {
        this.isLoading = false;
        this.errorMessage = 'La contraseña es obligatoria.';
        alert('La contraseña es obligatoria.');
        return;
      }

      console.log('👤 Enviando datos del formulario:', formValue);
      
      try {
        // Usamos una promesa para manejar mejor el flujo
        const response = await this.usuarioService.create(formValue).toPromise();
        console.log('✅ Respuesta del servidor:', response);
        
        // Mostrar mensaje de éxito
        if (response && response.message) {
          alert(`✅ ${response.message}`);
        } else {
          alert(`✅ Usuario ${formValue.nombre} ${formValue.apellido} creado correctamente`);
        }
        
        // Resetear el formulario
        this.usuarioForm.reset({
          rol: 'auxiliar de campo'
        });
        
      } catch (error: any) {
        console.error('❌ Error detallado:', {
          name: error.name,
          message: error.message,
          status: error.status,
          error: error.error,
          headers: error.headers
        });
        
        // Manejo de errores más detallado
        let errorMessage = 'Error al crear el usuario. Por favor, intente nuevamente.';
        
        if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión o intente más tarde.';
        } else if (error.error) {
          if (typeof error.error === 'string') {
            try {
              const parsedError = JSON.parse(error.error);
              errorMessage = parsedError.message || errorMessage;
            } catch (e) {
              // Si no se puede parsear como JSON, usar el mensaje de error directamente
              errorMessage = error.error || errorMessage;
            }
          } else if (error.error.message) {
            errorMessage = error.error.message;
          }
        }
        
        this.errorMessage = errorMessage;
        alert(`❌ ${errorMessage}`);
      } finally {
        this.isLoading = false;
      }
    } else {
      // Marcar todos los campos como tocados para mostrar errores de validación
      Object.keys(this.usuarioForm.controls).forEach(field => {
        const control = this.usuarioForm.get(field);
        if (control) {
          control.markAsTouched({ onlySelf: true });
        }
      });
      
      this.errorMessage = '⚠️ Por favor complete todos los campos obligatorios correctamente.';
      alert('⚠️ Por favor complete todos los campos obligatorios.');
    }
  }
}