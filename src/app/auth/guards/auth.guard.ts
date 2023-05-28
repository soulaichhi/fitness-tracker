import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

// The Class Guard is Deprecated in Angular14>, so we use the functional Guard
export function authGuard() {
  const isLog = inject(AuthService).isAuth();
  const router = inject(Router);
  if (isLog) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
}
