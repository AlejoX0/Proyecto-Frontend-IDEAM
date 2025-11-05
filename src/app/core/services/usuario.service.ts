import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // ruta relativa según tu proyecto

export interface Usuario {
  _id?: string;
  nro_documento?: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  rol?: string;
  departamento?: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  // Ajusta la URL base según tu backend (puerto/ruta)
  private baseUrl = 'http://localhost:3000/api/usuarios';

  private headers(): { headers: HttpHeaders } {
    const token = this.auth.getToken();
    const h = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
    return { headers: h };
  }

  // Obtener todos los usuarios
  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl, this.headers());
  }

  // Eliminar usuario por id
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, this.headers());
  }

  // (opcional) Obtener usuario por id
  getById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`, this.headers());
  }

  // (opcional) Crear usuario — útil si quieres integrar directamente con el backend
  create(payload: Partial<Usuario>): Observable<any> {
    return this.http.post(this.baseUrl, payload, this.headers());
  }

  // (opcional) Actualizar usuario
  update(id: string, payload: Partial<Usuario>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, payload, this.headers());
  }
}
