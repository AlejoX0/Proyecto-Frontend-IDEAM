import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;
  departamento?: string;
}

export interface LoginResponse {
  mensaje: string;
  token: string;
  usuario: Usuario;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // 🔹 URL base del backend (ajustada a tu servicio real)
  private apiUrl = 'http://localhost:3001/api/auth';

  // 🔹 LOGIN: guarda token y usuario
  login(correo: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { correo, password }).pipe(
      tap((res) => {
        // Guardar token y usuario en localStorage
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));

        // Redirigir según rol (por ahora todos van al inicio)
        if (res.usuario.rol === 'administrador') {
          this.router.navigate(['/inicio']);
        } else {
          this.router.navigate(['/inicio']);
        }
      })
    );
  }

  // 🔹 Cerrar sesión
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // 🔹 Obtener usuario actual
  getUsuario(): Usuario | null {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }

  // 🔹 Obtener token actual
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // 🔹 Saber si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // 🔹 Saber si tiene un rol permitido
  hasRole(roles: string[]): boolean {
    const usuario = this.getUsuario();
    return usuario ? roles.includes(usuario.rol.toLowerCase()) : false;
  }
}