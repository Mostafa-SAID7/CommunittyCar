import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Check if user is authenticated
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  if (token) {
    // TODO: Add token expiration check
    return true;
  }

  // If no token, redirect to login
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
