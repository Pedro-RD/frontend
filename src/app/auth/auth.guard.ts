import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth/auth.service';
import {map, tap} from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);


  return authService.getUser().pipe(
    map((user) => {
      if (!user) return false;
      // Check if the route has any role requirements
      const requiredRoles = route.data['roles'] as Array<string>;
      if (!requiredRoles || requiredRoles.length === 0) {
        return true; // No specific roles required, allow access
      }

      // Check if the user has any of the required roles
      return requiredRoles.some(role => user.role === role);
    }),
    tap((loggedIn) => {
      if (!loggedIn) router.navigate(['/forbidden'])
    })
  );
};
