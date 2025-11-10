import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Brigada {
  _id?: string;
  nombre: string;
  fecha_asignacion: string;
  id_conglomerado: string;
  lider: string;
}

@Injectable({ providedIn: 'root' })
export class BrigadaService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private baseUrl = 'http://localhost:4001/api/brigadas';

  private headers(): { headers: HttpHeaders } {
    const token: string | null = this.auth.getToken();
    let h = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) h = h.set('Authorization', `Bearer ${token}`);
    return { headers: h };
  }

  // 🔹 Crear brigada
  crearBrigada(data: Brigada): Observable<any> {
    return this.http.post(`${this.baseUrl}/crear`, data, this.headers());
  }

  // 🔹 Listar brigadas
  listarBrigadas(): Observable<Brigada[]> {
    return this.http.get<Brigada[]>(`${this.baseUrl}/listar`, this.headers());
  }
}