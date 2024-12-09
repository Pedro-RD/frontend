import { HttpInterceptorFn } from '@angular/common/http';
import { LoadingService } from './loading.service';
import { inject } from '@angular/core';
import { catchError, debounceTime, tap } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const ignoredUrls = ['messages', 'notifications', 'google'];
  if (ignoredUrls.some((url) => req.url.includes(url))) {
    return next(req);
  }
  loadingService.show();
  return next(req).pipe(
    debounceTime(200),
    tap(() => loadingService.hide()),
    catchError((error) => {
      loadingService.hide();
      throw error;
    }),
  );
};
