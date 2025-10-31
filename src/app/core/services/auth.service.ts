import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'ifn_token';
  private userKey = 'ifn_user';
  // default to false and set properly in constructor to avoid SSR accessing localStorage
  private _isAuthenticated$ = new BehaviorSubject<boolean>(false);

  isAuthenticated$ = this._isAuthenticated$.asObservable();

  constructor(private api: ApiService, private router: Router) {
    // Initialize authentication state only when running in the browser
    try {
      const token = this.getToken();
      this._isAuthenticated$.next(!!token);
    } catch {
      // In SSR or restricted environments, localStorage may be unavailable — keep default false
      this._isAuthenticated$.next(false);
    }
  }

  login(credentials: { email: string; password: string }) {
    // Ajusta la ruta si tu backend usa /api/auth/login o similar
    return this.api.post<any>(`${environment.apiAuthUrl}/auth/login`, credentials).pipe(
      map((res) => {
        if (res?.token) {
          try {
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem(this.tokenKey, res.token);
              localStorage.setItem(this.userKey, JSON.stringify(res.user || {}));
            }
          } catch {
            // ignore storage errors during SSR
          }
          this._isAuthenticated$.next(true);
        }
        return res;
      })
    );
  }

  logout() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
      }
    } catch {
      // ignore
    }
    this._isAuthenticated$.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    try {
      if (typeof localStorage === 'undefined') return null;
      return localStorage.getItem(this.tokenKey);
    } catch {
      return null;
    }
  }

  getUser() {
    try {
      if (typeof localStorage === 'undefined') return null;
      const u = localStorage.getItem(this.userKey);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }
}
