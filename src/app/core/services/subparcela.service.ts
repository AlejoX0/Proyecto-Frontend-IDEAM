// src/app/core/services/subparcela.service.ts
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

// Interfaz corregida (ya la tenías)
export interface Subparcela {
  id_subparcela: number;
  id_conglomerado: number;
  categoria: string;
  radio: number;
  area?: number;
  centro_lat?: number;
  centro_lon?: number;
  centro_lng?: number;
}

@Injectable({ providedIn: 'root' })
export class SubparcelaService {
  private readonly baseUrl = `${environment.apiConglomeradosUrl}/subparcelas`;

  constructor(private api: ApiService) {}

  // ✅ NUEVO MÉTODO (Este era el que faltaba)
  // GET /api/subparcelas
  listarTodas(): Observable<Subparcela[]> {
    return this.api.get<Subparcela[]>(this.baseUrl);
  }

  // GET /api/subparcelas/conglomerado/:id_conglomerado
  listarPorConglomerado(id_conglomerado: number, params?: { [key: string]: any }): Observable<Subparcela[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((k) => {
        if (params[k] !== undefined && params[k] !== null) {
          httpParams = httpParams.set(k, String(params[k]));
        }
      });
    }
    return this.api.get<Subparcela[]>(`${this.baseUrl}/conglomerado/${id_conglomerado}`, httpParams);
  }

  // GET /api/subparcelas/:id
  detalle(id_subparcela: number): Observable<Subparcela> {
    return this.api.get<Subparcela>(`${this.baseUrl}/${id_subparcela}`);
  }
}