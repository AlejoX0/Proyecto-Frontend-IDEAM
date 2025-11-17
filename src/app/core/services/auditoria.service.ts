import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Auditoria {
  accion: string;
  usuario_afectado?: string;
  admin_correo: string;
  admin_id?: string;
  fecha: string;
  detalle?: string;
}

interface AuditoriaResponse {
  auditorias?: Auditoria[];
}

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private readonly baseUrl = `${environment.apiAuthUrl}/auditorias`;

  constructor(private http: HttpClient) {}

  obtenerRecientes(limit = 8): Observable<Auditoria[]> {
    return this.http.get<AuditoriaResponse>(this.baseUrl).pipe(
      map((resp) => {
        const registros = resp.auditorias ?? [];
        return registros.slice(0, limit);
      })
    );
  }
}
