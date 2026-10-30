import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly _accessToken = signal<string | null>(null);
  private readonly _currentUser = signal<unknown | null>(null);
  // private readonly _remmberMeValue = signal<boolean>(false);

  // واجهات قراءة عامة (Read-only) عشان الكومپوننتات تقرأ منها بس
  readonly accessToken = this._accessToken.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();
  // readonly remmberMeValue = this._remmberMeValue.asReadonly();
  constructor() {
    this._accessToken.set(this.getInitialToken());
  }

  // Computed Signal عشان نعرف هل المستخدم مسجل دخول ولا لا بسهولة
  readonly isAuthenticated = computed(() => !!this._accessToken());

  // دالة لجلب التوكن المبدئي عند فتح التطبيق (تدعم الـ LocalStorage والـ SessionStorage وتتحقق من صلاحية الشهر)
  private getInitialToken(): string | null {
    // 1. فحص الـ LocalStorage (لو الـ Remember Me كانت مفعلة)
    const localSession = localStorage.getItem('session');
    if (localSession) {
      try {
        const parsed = JSON.parse(localSession);
        // التحقق من أن الشهر لم ينتهِ بعد
        if (parsed.expiresAt && new Date().getTime() < parsed.expiresAt) {
          return parsed.access_token;
        } else {
          // انتهت الصلاحية، يتم التنظيف
          localStorage.removeItem('session');
        }
      } catch (e) {
        console.log(e);
        localStorage.removeItem('session');
      }
    }

    // 2. فحص الـ SessionStorage (الجلسة العادية)
    return sessionStorage.getItem('access_token');
  }

  // حفظ بيانات الدخول بعد الـ Signup أو الـ Login الناجح
  setSession(
    accessToken: string,
    refreshToken: string,
    user: unknown,
    rememberMe: boolean,
    expiresIn?: number,
    expiresAt?: number,
  ) {
    this._accessToken.set(accessToken);
    this._currentUser.set(user);

    if (rememberMe) {
      let finalExpiresAt: number;
      if (expiresAt) {
        // بما إن الـ expiresAt راجع كـ Unix Timestamp بالثواني، بنضربه في 1000 عشان يتحول لـ Milliseconds
        finalExpiresAt = expiresAt * 1000;
      } else if (expiresIn) {
        // أو لو هنعتمد على الـ expires_in
        finalExpiresAt = new Date().getTime() + expiresIn * 1000;
      } else {
        finalExpiresAt = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
      }
      // حساب تاريخ انتهاء بعد شهر كامل (30 يوم)
      // const expiresAt = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
      const sessionData = {
        access_token: accessToken,
        refresh_token: refreshToken,
        expiresAt: finalExpiresAt,
      };
      localStorage.setItem('session', JSON.stringify(sessionData));
    } else {
      // التخزين المؤقت لجلسة المتصفح
      sessionStorage.setItem('access_token', accessToken);
      sessionStorage.setItem('refresh_token', refreshToken);
    }

    // this._remmberMeValue.set(remmberMe);
    // if(remmberMe){

    // }
  }

  // تحديث الـ Access Token فقط (تستخدم غالباً بعد عملية الـ Refresh)
  setAccessToken(token: string) {
    this._accessToken.set(token);
    // تحديثه في التخزين النشط حالياً
    if (localStorage.getItem('session')) {
      const session = JSON.parse(localStorage.getItem('session')!);
      session.access_token = token;
      localStorage.setItem('session', JSON.stringify(session));
    } else if (sessionStorage.getItem('access_token')) {
      sessionStorage.setItem('access_token', token);
    }
  }

  // مسح البيانات (Logout)
  clearSession() {
    this._accessToken.set(null);
    this._currentUser.set(null);
    localStorage.removeItem('session');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    // this._remmberMeValue.set(false);
  }
}
