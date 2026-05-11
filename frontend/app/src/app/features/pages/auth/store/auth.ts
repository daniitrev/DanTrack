import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { AuthResponse, UserModel } from '../model/auth';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, firstValueFrom, pipe } from 'rxjs';
import { ApiService } from '../../../../core/service/api/api';
import { computed, inject } from '@angular/core';
import { HttpEntity, loadStateEntity$ } from '../../../../shared/loadStateFunction';
import { AuthService } from '../service/auth';
import { Router } from '@angular/router';
import {RegisterDto} from '../pages/page-registration/model/page-registration';
import {LoginDto} from '../pages/page-login/model/page-login';

type AuthState = {
  userState: HttpEntity<UserModel | null>;
  isAuthenticated: boolean;
};

export const AuthStore = signalStore(
  {
    providedIn: 'root',
  },
  withState<AuthState>({
    userState: {
      data: null,
      loading: false,
      error: null,
    },
    isAuthenticated: false,
  }),

  withComputed((store) => ({
    isLoggedIn: computed(() => store.isAuthenticated()),
  })),

  withMethods((store) => {
    const router = inject(Router);
    const api = inject(ApiService);
    const auth = inject(AuthService);

    const resetAuthState = () => {
      patchState(store, {
        isAuthenticated: false,
        userState: {
          data: null,
          loading: false,
          error: null,
        },
      });
    };

    return {
      register: rxMethod<RegisterDto>(
        pipe(
          exhaustMap((payload) => {
            return loadStateEntity$<UserModel | null, AuthResponse>({
              mapData: (response) => response.user,
              patchSlice: (updater) =>
                patchState(store, (state) => ({ userState: updater(state.userState) })),
              fetch$: () => api.post<AuthResponse, RegisterDto>('/api/v1/auth/register', payload),
              mapError: (err) => `Ошибка при регистрации: ${String(err)}`,
              onSuccess: (response) => {
                patchState(store, (state) => ({
                  userState: {
                    ...state.userState,
                    data: response.user,
                  },
                }));
                void router.navigate(['/login']);
              },
            });
          }),
        ),
      ),
      login: rxMethod<LoginDto>(
        pipe(
          exhaustMap((payload) => {
            return loadStateEntity$<UserModel | null, AuthResponse>({
              mapData: (response) => response.user,
              patchSlice: (updater) =>
                patchState(store, (state) => ({ userState: updater(state.userState) })),
              fetch$: () => api.post<AuthResponse, LoginDto>('/api/v1/auth/login', payload),
              mapError: (err) => `Ошибка при входе: ${String(err)}`,
              onSuccess: (response) => {
                patchState(store, (state) => ({
                  isAuthenticated: true,
                  userState: {
                    ...state.userState,
                    data: response.user,
                  },
                }));
                void router.navigate(['/main']);
              },
            });
          }),
        ),
      ),

      async checkAuth() {
        const token = auth.readCookie('accessToken');
        if (token) {
          patchState(store, { isAuthenticated: true });
          return;
        }

        try {
          const response = await firstValueFrom(auth.refresh());

          if (response) {
            patchState(store, { isAuthenticated: true });
            return;
          }
        } catch {}

        resetAuthState();
      },

      logout: rxMethod<void>(
        pipe(
          exhaustMap(() => {
            return loadStateEntity$<UserModel | null, null>({
              mapData: () => null,
              patchSlice: (updater) =>
                patchState(store, (state) => ({ userState: updater(state.userState) })),
              fetch$: () => api.post<null>('/api/v1/auth/logout'),
              mapError: (err) => `Ошибка при выходе: ${String(err)}`,
              onSuccess: () => {
                resetAuthState();
                void router.navigate(['/login']);
              },
            });
          }),
        ),
      ),
    };
  }),
);
