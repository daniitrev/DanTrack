import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../../core/service/api/api';
import { BehaviorSubject, catchError, filter, of, switchMap, take, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse } from '../model/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly router = inject(Router);
  readonly apiService = inject(ApiService);
  isRefreshing$ = new BehaviorSubject<boolean>(false);
  tokenRefresh$ = new BehaviorSubject<string | null>(null);

  refresh() {
    if (this.isRefreshing$.value) {
      return this.tokenRefresh$.pipe(
        filter((token) => token !== null),
        take(1),
      );
    }
    this.tokenRefresh$.next(null);
    this.isRefreshing$.next(true);

    return this.apiService.post<AuthResponse>('/api/v1/auth/refresh').pipe(
      switchMap(() => {
        const freshToken = this.readCookie('accessToken');
        this.isRefreshing$.next(false);
        this.tokenRefresh$.next(freshToken);
        return of(freshToken);
      }),
      catchError((err) => {
        this.isRefreshing$.next(false);
        this.tokenRefresh$.next(null);
        void this.router.navigate(['/login']);
        return throwError(() => err);
      }),
    );
  }

  readCookie(name: string) {
    if (typeof document === 'undefined') {
      return null;
    }

    const pair = document.cookie.split('; ').find((item) => item.startsWith(`${name}=`));

    return pair ? decodeURIComponent(pair.split('=').slice(1).join('=')) : null;
  }
}
