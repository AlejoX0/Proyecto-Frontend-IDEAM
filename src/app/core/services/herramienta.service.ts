import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Herramienta {
  id_herramienta: number;
  nombre: string;
  descripcion?: string;
  estado?: string;
  cantidad_disponible?: number;
}

export interface CrearHerramientaDto {
  nombre: string;
  descripcion: string;
  cantidad_disponible: number;
}

@Injectable({
  providedIn: 'root'
})
export class HerramientaService {
  private baseUrl = `${environment.apiBrigadasUrl}/api/herramientas`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('⚠ No se encontró token en localStorage. Enviando petición sin Authorization.');
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  listar(): Observable<Herramienta[]> {
    return this.http
      .get<{ herramientas?: Herramienta[] } | Herramienta[]>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        map((response) => {
          if (Array.isArray(response)) {
            return response;
          }
          return response?.herramientas ?? [];
        })
      );
  }

  crear(data: CrearHerramientaDto): Observable<Herramienta> {
    return this.http.post<Herramienta>(this.baseUrl, data, { headers: this.getHeaders() });
  }
}
