import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiErrorsService {
  private errorsSubject = new BehaviorSubject<string[]>([]);
  errors$ = this.errorsSubject.asObservable();

  showErrors(errors: string[]): void {
    this.errorsSubject.next(errors);
  }

  clearErrors(): void {
    this.errorsSubject.next([]);
  }
}
