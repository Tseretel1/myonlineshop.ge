import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { AppRoutes } from './app/shared/AppRoutes/AppRoutes';
import { AuthorizationService } from './app/pages/authorization/authorization.service';
import { Router } from '@angular/router';
export const httpInterceptor: HttpInterceptorFn = (request, next) => {

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const authService = inject(AuthorizationService);
  const router = inject(Router);

  function redirectToLogin(): void {
    authService.forceLogout();
  }

  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        redirectToLogin();
      }
      return throwError(() => error);
    })
  );
};
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;

    if (!exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  } catch {
    return true;
  }
}