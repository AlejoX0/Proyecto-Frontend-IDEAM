import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar implements OnInit {
  isMenuOpen = false;
  activeDropdown: string | null = null;
  usuario: any = null;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown(menu: string): void {
    this.activeDropdown = this.activeDropdown === menu ? null : menu;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    this.activeDropdown = null;
  }

  logout(): void {
    this.authService.logout();
  }

  // ✅ Métodos para control de roles
  esAdmin(): boolean {
    return this.usuario?.rol?.toLowerCase() === 'administrador';
  }

  esJefe(): boolean {
    return this.usuario?.rol?.toLowerCase() === 'jefe de brigada';
  }

  esBotanico(): boolean {
    return this.usuario?.rol?.toLowerCase() === 'botanico';
  }

  esAuxiliar(): boolean {
    return this.usuario?.rol?.toLowerCase() === 'auxiliar de campo';
  }

  esCoinvestigador(): boolean {
    return this.usuario?.rol?.toLowerCase() === 'coinvestigador';
  }
}