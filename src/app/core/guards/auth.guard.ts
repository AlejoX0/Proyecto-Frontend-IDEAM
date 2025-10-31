import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const usuario = authService.getUsuario();

  // Si no hay token → redirige al login
  if (!authService.isAuthenticated() || !usuario) {
    router.navigate(['/login']);
    return false;
  }

  // Si la ruta tiene un rol específico (ejemplo: administrador)
  const rolesPermitidos = route.data?.['roles'] as string[];

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    // Si no tiene el rol → lo manda a la vista normal
    router.navigate(['/usuario']);
    return false;
  }

  // ✅ Todo bien, puede entrar
  return true;
};
