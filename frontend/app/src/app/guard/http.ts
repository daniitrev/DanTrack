import { AuthService } from '../features/pages/auth/service/auth';
import { inject } from '@angular/core';
import { catchError, of, switchMap, throwError } from 'rxjs';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

export function AuthInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const auth = inject(AuthService);
  const isApiUrl = req.url.includes('/api/v1/');

  if (!isApiUrl) {
    return next(req);
  }

  return of(auth.readCookie('accessToken')).pipe(
    switchMap((authToken) => {
      const request = authToken
        ? req.clone({
            setHeaders: {
              Authorization: `Bearer ${authToken}`,
            },
            withCredentials: true,
          })
        : req.clone({ withCredentials: true });

      return next(request).pipe(
        catchError((err) => {
          if (err.status !== 401 || req.url.includes('/refresh')) {
            return throwError(() => err);
          }

          return auth.refresh().pipe(
            switchMap((newToken) => {
              const finalToken = newToken ?? auth.readCookie('accessToken');

              if (!finalToken) {
                return throwError(() => err);
              }

              return next(
                request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${finalToken}`,
                  },
                  withCredentials: true,
                }),
              );
            }),
          );
        }),
      );
    }),
  );
}
