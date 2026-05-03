import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthStore } from './features/pages/auth/store/auth';
import { AuthInterceptor } from './guard/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideZonelessChangeDetection(),
    provideAppInitializer(() => {
      const store = inject(AuthStore);
      return store.checkAuth();
    }),
  ],
};
