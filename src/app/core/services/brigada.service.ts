import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Brigada {
  id_brigada?: number;
  nombre: string;
  departamento: string;
  id_conglomerado: number;
  lider: string;
  fecha_asignacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class BrigadaService {
  private baseUrl = `${environment.apiBrigadasUrl}/api/brigadas`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No se encontró el token en localStorage');
      throw new Error('Token requerido');
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  crearBrigada(data: Brigada): Observable<Brigada> {
    const headers = this.getHeaders();
    return this.http.post<Brigada>(this.baseUrl, data, { headers });
  }

  listarBrigadas(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(this.baseUrl, { headers });
  }

  asignarConglomerado(id_brigada: number, id_conglomerado: number): Observable<any> {
    const headers = this.getHeaders();
    const data = { id_conglomerado };
    const url = `${this.baseUrl}/${id_brigada}/conglomerado`;
    return this.http.put(url, data, { headers });
  }
}