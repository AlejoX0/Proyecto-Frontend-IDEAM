import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-eliminar-usuario',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './eliminar-usuario.html',
  styleUrls: ['./eliminar-usuario.scss']
})
export class EliminarUsuario implements OnInit {
  usuarios: any[] = [];
  apiUrl = 'http://localhost:3001/api/usuarios'; // ✅ ajusta al puerto del backend

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: (data) => (this.usuarios = data),
      error: (err) => console.error('Error cargando usuarios:', err),
    });
  }

  eliminarUsuario(idUsuario: string): void {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.delete(`${this.apiUrl}/${idUsuario}`, { headers }).subscribe({
      next: () => {
        alert('✅ Usuario eliminado correctamente');
        this.usuarios = this.usuarios.filter((u) => u._id !== idUsuario);
      },
      error: (err) => {
        console.error('Error eliminando usuario:', err);
        alert('❌ No se pudo eliminar el usuario');
      },
    });
  }
}
