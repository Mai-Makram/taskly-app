import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly _accessToken = signal<string | null>(null);
  private readonly _currentUser = signal<unknown | null>(null);

  // واجهات قراءة عامة (Read-only) عشان الكومپوننتات تقرأ منها بس
  readonly accessToken = this._accessToken.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();

  // Computed Signal عشان نعرف هل المستخدم مسجل دخول ولا لا بسهولة
  readonly isAuthenticated = computed(() => !!this._accessToken());

  // حفظ بيانات الدخول بعد الـ Signup أو الـ Login الناجح
  setSession(token: string, user: unknown) {
    this._accessToken.set(token);
    this._currentUser.set(user);
  }

  // مسح البيانات (Logout)
  clearSession() {
    this._accessToken.set(null);
    this._currentUser.set(null);
  }
}
