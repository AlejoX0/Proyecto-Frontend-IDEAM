import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  // 🔐 Login
  { path: 'login', component: LoginComponent },

  // 🏠 Inicio
  {
    path: 'inicio',
    loadComponent: () =>
      import('./inicio/inicio').then((m) => m.Inicio),
  },

  // 🧭 Navbar (opcional)
  {
    path: 'navbar',
    loadComponent: () =>
      import('./navbar/navbar').then((m) => m.Navbar),
  },

  // 👤 USUARIOS
  {
    path: 'crear-usuario',
    loadComponent: () =>
      import('./crear-usuario/crear-usuario').then((m) => m.CrearUsuario),
  },
  {
    path: 'eliminar-usuario',
    loadComponent: () =>
      import('./eliminar-usuario/eliminar-usuario').then((m) => m.EliminarUsuario),
  },

  // 👷 BRIGADAS
  {
    path: 'crear-brigada',
    loadComponent: () =>
      import('./crear-brigada/crear-brigada').then((m) => m.CrearBrigada),
  },
  {
    path: 'asignar-conglomerado',
    loadComponent: () =>
      import('./asignar-conglomerado/asignar-conglomerado').then((m) => m.AsignarConglomerado),
  },
  {
    path: 'listar-brigadas',
    loadComponent: () =>
      import('./listar-brigadas/listar-brigadas').then((m) => m.ListarBrigadas),
  },

  // 🌲 CONGLOMERADOS
  {
    path: 'crear-conglomerado-manual',
    loadComponent: () =>
      import('./crear-conglomerado-manual/crear-conglomerado-manual').then((m) => m.CrearConglomeradoManual),
  },
  {
    path: 'crear-conglomerado-automatico',
    loadComponent: () =>
      import('./crear-conglomerado-automatico/crear-conglomerado-automatico').then((m) => m.CrearConglomeradoAutomatico),
  },
  {
    path: 'listar-conglomerados',
    loadComponent: () =>
      import('./listar-conglomerados/listar-conglomerados').then((m) => m.ListarConglomerados),
  },
  {
    path: 'listar-subparcelas',
    loadComponent: () =>
      import('./listar-subparcelas/listar-subparcelas').then((m) => m.ListarSubparcelas),
  },

  // 🔁 Redirecciones
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' },
];