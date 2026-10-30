import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, SignupRequest } from '../models/auth.model';
import { Observable, tap } from 'rxjs';
import { AuthStore } from './auth-store.service';
// import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly baseUrl = environment.apiUrl;

  signup(payload: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/v1/signup`, payload);
  }

  login(payload: LoginRequest, rememberMe: boolean): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/v1/token?grant_type=password`, payload)
      .pipe(
        tap((response) => {
          // بنمرر البيانات كلها للـ AuthStore عشان يتعامل مع التخزين (Local/Session) والـ Remember Me
          this.authStore.setSession(
            response.access_token,
            response.refresh_token,
            response.user,
            rememberMe,
            response.expires_in,
            response.expires_at,
          );
        }),
      );
  }

  refreshToken() {
    const storedSession = localStorage.getItem('session');
    let refreshTokenVal;

    if (storedSession) {
      try {
        refreshTokenVal = JSON.parse(storedSession).refresh_token;
      } catch {
        refreshTokenVal = '';
      }
    } else {
      refreshTokenVal = sessionStorage.getItem('refresh_token') || '';
    }

    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/v1/token?grant_type=refresh_token`, {
        refresh_token: refreshTokenVal,
      })
      .pipe(
        tap((response) => {
          // لو الـ API رجع access_token جديد، بنحدثه في الـ Store
          this.authStore.setAccessToken(response.access_token);
        }),
      );
  }

  // دالة تسجيل الخروج (Logout)
  logout() {
    this.authStore.clearSession();
  }

  //   private readonly storageKey = 'taskly-user';
  //   private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(this.loadUserFromStorage());

  //   readonly currentUser$ = this.currentUserSubject.asObservable();

  //   login(email: string, password: string): Observable<AuthUser> {
  //     if (!email || !password) {
  //       return throwError(() => new Error('Email and password are required.'));
  //     }

  //     const user: AuthUser = {
  //       id: globalThis.crypto?.randomUUID?.() ?? Date.now().toString(),
  //       email,
  //       name: email.split('@')[0],
  //     };

  //     this.setCurrentUser(user);

  //     return of(user).pipe(delay(300));
  //   }

  //   logout(): void {
  //     this.setCurrentUser(null);
  //   }

  //   isAuthenticated(): boolean {
  //     return !!this.currentUserSubject.value;
  //   }

  //   getCurrentUser(): AuthUser | null {
  //     return this.currentUserSubject.value;
  //   }

  //   private setCurrentUser(user: AuthUser | null): void {
  //     if (typeof window !== 'undefined') {
  //       if (user) {
  //         window.localStorage.setItem(this.storageKey, JSON.stringify(user));
  //       } else {
  //         window.localStorage.removeItem(this.storageKey);
  //       }
  //     }

  //     this.currentUserSubject.next(user);
  //   }

  //   private loadUserFromStorage(): AuthUser | null {
  //     if (typeof window === 'undefined') {
  //       return null;
  //     }

  //     const savedUser = window.localStorage.getItem(this.storageKey);

  //     if (!savedUser) {
  //       return null;
  //     }

  //     try {
  //       return JSON.parse(savedUser) as AuthUser;
  //     } catch {
  //       window.localStorage.removeItem(this.storageKey);
  //       return null;
  //     }
  //   }
}
