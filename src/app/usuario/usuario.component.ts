import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent implements OnInit {
  private authService = inject(AuthService);
  usuario = this.authService.getUsuario();
  rol: string = '';

  ngOnInit() {
    this.rol = this.usuario?.rol || '';
  }

  mostrar(roles: string[]): boolean {
    return roles.includes(this.rol);
  }

  logout() {
    this.authService.logout();
  }
}
