import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; // ✅ ruta corregida
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // 🔒 Solo los administradores
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { roles: ['administrador'] },
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent)
  },

  // 👨‍🌾 Cualquier usuario autenticado
  {
    path: 'usuario',
    canActivate: [AuthGuard],
    data: { roles: ['botánico', 'jefe de brigada', 'auxiliar de campo', 'coinvestigador', 'administrador'] },
    loadComponent: () => import('./usuario/usuario.component').then(m => m.UsuarioComponent)
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
