import { HttpInterceptorFn } from '@angular/common/http';
import { AuthStore } from '../services/auth-store.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiKey = 'sb_publishable_TFhunEQzIbw6Dors_eHt9g_62kzM-ov'; // ضيفي الـ API Key بتاعك

  const authStore = inject(AuthStore);
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

  return next(modifiedReq);
};
