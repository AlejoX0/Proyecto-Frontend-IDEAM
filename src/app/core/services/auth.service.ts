import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;
}

interface LoginResponse {
  mensaje: string;
  token: string;
  usuario: Usuario;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/api/auth'; // <-- Ajusta si tu backend usa otro puerto

  // 🔹 Login: guarda token y usuario y redirige según rol
  login(correo: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { correo, password }).pipe(
      tap((res) => {
        // Guardar token y usuario en localStorage
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));

        // Redirigir según el rol
        if (res.usuario.rol === 'administrador') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/usuario']);
        }
      })
    );
  }

  // 🔹 Cerrar sesión
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // 🔹 Obtener usuario actual
  getUsuario(): Usuario | null {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }

  // 🔹 Obtener token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // 🔹 Verificar si está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // 🔹 NUEVO: Verificar si tiene alguno de los roles dados
  hasRole(roles: string[]): boolean {
    const usuario = this.getUsuario();
    return usuario ? roles.includes(usuario.rol) : false;
  }
}
