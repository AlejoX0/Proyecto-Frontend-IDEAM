import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Subparcela } from './subparcela.service';

export interface Conglomerado {
  id_conglomerado?: number;
  codigo: string;
  departamento: string;
  municipio: string;
  vereda: string;
  coordenadas: string;
}

// Datos reducidos cuando solo necesitamos pintar el mapa
export interface ConglomeradoMapa {
  id_conglomerado: number;
  codigo: string;
  lat: number;
  lng: number;
  estado: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  ubicacion?: {
    lat: number;
    lng: number;
    region?: string;
    departamento?: string;
  };
  departamento?: string;
  municipio?: string;
  vereda?: string;
}

// Detalle completo entregado por /api/conglomerados/:id
export interface ConglomeradoDetalle {
  id_conglomerado: number;
  codigo: string;
  estado: string;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  ubicacion?: {
    lat: number;
    lng: number;
    region?: string;
    departamento?: string;
  };
  departamento?: string;
  municipio?: string;
  vereda?: string;
}

export interface ConglomeradoDetalleResponse {
  conglomerado: ConglomeradoDetalle;
  subparcelas: Subparcela[];
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

  // Crear manualmente
  crearManual(data: Conglomerado): Observable<any> {
    return this.http.post(`${this.apiUrl}/manual`, data, this.headers());
  }

  // Crear automáticamente
  crearAutomatico(params: any = {}): Observable<any> {
    return this.http.post(`${this.apiUrl}/auto`, params, this.headers());
  }

  // Listar todos (estructura original)
  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.headers());
  }

  // Listar solo lo necesario para el mapa
  listarMapa(): Observable<ConglomeradoMapa[]> {
    return this.http.get<ConglomeradoMapa[]>(this.apiUrl, this.headers());
  }

  // Detalle con subparcelas incluidas
  detalle(id: number): Observable<ConglomeradoDetalleResponse> {
    return this.http.get<ConglomeradoDetalleResponse>(`${this.apiUrl}/${id}`, this.headers());
  }
}
