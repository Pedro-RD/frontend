import { Component, inject } from '@angular/core';
import { ApiErrorsService } from '../../services/helpers/api-errors.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-modal-error',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './modal-error.component.html',
})
export class ModalErrorComponent {
  private readonly errorService = inject(ApiErrorsService);

  get errors$() {
    return this.errorService.errors$;
  }

  clearErrors(): void {
    this.errorService.clearErrors();
  }
}
