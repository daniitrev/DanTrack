import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../features/pages/auth/store/auth';

function checkAccess() {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  return authStore.isLoggedIn() ? true : router.createUrlTree(['/login']);
}

export const AuthGuard: CanActivateFn = () => checkAccess();
export const AuthChildGuard: CanActivateChildFn = () => checkAccess();
