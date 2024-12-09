import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { ApiErrorsService } from './api-errors.service';
import { environment } from '../../../environments/environment';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const apiErrorsService = inject(ApiErrorsService);
  return next(req).pipe(
    catchError((error) => {
      if (!environment.production)
        console.log('errorInterceptor', `Url: ${req.url}`, req.body, error);
      if (error.status === 403) {
        router.navigate(['/forbidden']);
      } else if (error.status === 404) {
        router.navigate(['/not-found']);
      } else if (error.status === 401 && !req.url.includes('login')) {
        router.navigate(['/login']);
      } else {
        if (error.error && error.error.message) {
          apiErrorsService.showErrors([error.error.message]);
        } else if (error.error && error.error.errors) {
          apiErrorsService.showErrors(error.error.errors);
        } else {
          apiErrorsService.showErrors(['Ocorreu um erro inesperado']);
        }
      }
      throw error;
    }),
  );
};
