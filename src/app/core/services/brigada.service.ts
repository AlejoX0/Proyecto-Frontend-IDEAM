import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Brigada {
  id_brigada?: number;
  nombre?: string;
  departamento: string;
  id_conglomerado: number | null;
  lider: number;
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
      // Antes lanzabas Error('Token requerido') — eso puede romper todo si no hay token.
      // Mejor warn y devolver headers sin Authorization (siempre que tu backend lo permita).
      console.warn('⚠ No se encontró el token en localStorage. Enviando petición sin Authorization.');
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  crearBrigada(data: Brigada): Observable<Brigada> {
    const headers = this.getHeaders();
    console.log('brigada.service -> crearBrigada payload:', data);
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

  agregarAuxiliar(
    id_brigada: number,
    id_auxiliar: number,
    rol_en_brigada: string = 'auxiliar de campo'
  ): Observable<any> {
    const headers = this.getHeaders();
    const url = `${environment.apiBrigadasUrl}/api/usuario-brigada`;
    const payload = {
      id_usuario: id_auxiliar,
      id_brigada,
      rol_en_brigada
    };
    return this.http.post(url, payload, { headers });
  }

  agregarHerramienta(id_brigada: number, id_herramienta: number): Observable<any> {
    const headers = this.getHeaders();
    const url = `${environment.apiBrigadasUrl}/api/herramientas/uso`;
    const payload = {
      id_brigada,
      id_herramienta,
      estado: 'activo'
    };
    return this.http.post(url, payload, { headers });
  }
}
