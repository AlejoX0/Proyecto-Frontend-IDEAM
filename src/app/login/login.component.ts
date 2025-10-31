import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginForm = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  errorMsg: string = '';

  onSubmit() {
  if (this.loginForm.invalid) return;

  const { correo, password } = this.loginForm.value;

  // Asegúrate de pasar ambos valores
  this.authService.login(correo!, password!).subscribe({
    next: () => console.log('✅ Login correcto'),
    error: (err: any) => {
      console.error('❌ Error de login', err);
      this.errorMsg = err.error?.error || 'Error al iniciar sesión';
    },
  });
}
}
