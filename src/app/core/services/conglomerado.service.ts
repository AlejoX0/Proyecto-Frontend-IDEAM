import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Conglomerado {
  id_conglomerado?: number;
  codigo: string;
  departamento: string;
  municipio: string;
  vereda: string;
  coordenadas: string;
}

// ➕ NUEVA INTERFAZ SOLO PARA EL MAPA
export interface ConglomeradoMapa {
  id_conglomerado: number;
  codigo: string;
  lat: number;
  lng: number;
  estado: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
}

@Injectable({ providedIn: 'root' })
export class ConglomeradoService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiUrl = 'http://localhost:4002/api/conglomerados';

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

  // 🔹 Listar todos (estructura original)
  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.headers());
  }

  // 🔹 LISTAR PARA MAPA (lat, lng)
  listarMapa(): Observable<ConglomeradoMapa[]> {
    return this.http.get<ConglomeradoMapa[]>(this.apiUrl, this.headers());
  }
}
