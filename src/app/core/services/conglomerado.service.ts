import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Conglomerado {
  id?: number;
  nombre: string;
  departamento: string;
  municipio: string;
  vereda: string;
  coordenadas: string;
}

@Injectable({ providedIn: 'root' })
export class ConglomeradoService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiUrl = 'http://localhost:3001/api/conglomerados';

  private headers() {
    const token = this.auth.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      }),
    };
  }

  // 🔹 Crear manualmente
  crearManual(data: Conglomerado): Observable<any> {
    return this.http.post(`${this.apiUrl}/manual`, data, this.headers());
  }

  // 🔹 Crear automáticamente
  crearAutomatico(params: any = {}): Observable<any> {
    return this.http.post(`${this.apiUrl}/auto`, params, this.headers());
  }

  // 🔹 Listar todos los conglomerados
  listar(): Observable<Conglomerado[]> {
    return this.http.get<Conglomerado[]>(`${this.apiUrl}/listar`, this.headers());
  }
}