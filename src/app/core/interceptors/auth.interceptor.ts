import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthStore } from '../services/auth-store.service';
import { AuthService } from '../services/auth.service'; // استدعاء الـ AuthService اللي فيه دالة الـ refreshToken
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiKey = 'sb_publishable_TFhunEQzIbw6Dors_eHt9g_62kzM-ov'; // ضيفي الـ API Key بتاعك

  const authStore = inject(AuthStore);
  const authService = inject(AuthService);
  const token = authStore.accessToken();

  // تجهيز الـ Headers الأساسية اللي بتنبعت في كل الـ Requests
  const headersConfig: Record<string, string> = {
    'Content-Type': 'application/json',
    apikey: apiKey,
  };

  // لو التوكن موجود، بنضيفه للـ Headers
  if (token) {
    headersConfig['Authorization'] = `Bearer ${token}`;
  }

  const modifiedReq = req.clone({
    setHeaders: headersConfig,
  });

  // return next(modifiedReq);

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // لو الـ API رجع 401 يعني التوكن انتهى (Unauthorized)
      if (error.status === 401 && !req.url.includes('/auth/v1/token')) {
        // بنحاول نجدد التوكن باستخدام الـ Refresh Token
        return authService.refreshToken().pipe(
          switchMap((response) => {
            // بنحدث الـ Store بالتوكن الجديد
            authStore.setAccessToken(response.access_token);

            // بنجهز الطلب القديم اللي فشل بس بالتوكن الجديد
            const clonedReq = req.clone({
              setHeaders: {
                ...headersConfig,
                Authorization: `Bearer ${response.access_token}`,
              },
            });

            // بنعيد إرسال الطلب الأصلي تاني من غير ما اليوزر يحس بشيء
            return next(clonedReq);
          }),
          catchError((refreshError) => {
            // لو عملية تجديد التوكن نفسها فشلت (يعني الـ Refresh Token انتهى هو كمان)
            // بنعمل Logout ونطرد اليوزر يسجل دخول من جديد
            authService.logout();
            return throwError(() => refreshError);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
