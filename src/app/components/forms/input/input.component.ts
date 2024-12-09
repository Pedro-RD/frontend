import {
  Component,
  computed,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './input.component.html',
})
export class InputComponent<T> implements OnInit, OnDestroy {
  label = input.required<string>();
  placeholder = input.required<string>();
  type = input<string>();
  required = input<boolean>(false);
  control = input.required<FormControl<T>>();
  showErrorSignal = signal<boolean>(false);
  showError = computed(() => {
    return this.showErrorSignal();
  });

  errorMessageSignal = signal<string>('');
  errorMessage = computed(() => this.errorMessageSignal());

  subscription?: Subscription;

  get displayLabel() {
    return `${this.label()}${this.required() ? ' *' : ''}`;
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.control().valueChanges.subscribe({
      next: (value) => {
        this.updateValidation();
      },
      error: (err) => {
        if (!environment.production)
          console.error('Input validation error', err);
      },
    });
  }

  private updateValidation = () => {
    const control = this.control();
    this.showErrorSignal.set(control.invalid);

    if (control.errors?.['required']) {
      this.errorMessageSignal.set('Este campo é obrigatório');
    } else if (control.errors?.['email']) {
      this.errorMessageSignal.set('Por favor, introduza um email válido');
    } else if (control.errors?.['minlength']) {
      this.errorMessageSignal.set(
        `O comprimento mínimo é ${control.errors?.['minlength'].requiredLength}`,
      );
    } else if (control.errors?.['maxlength']) {
      this.errorMessageSignal.set(
        `O comprimento máximo é ${control.errors?.['maxlength'].requiredLength}`,
      );
    } else if (control.errors?.['pattern']) {
      this.errorMessageSignal.set('Formato inválido');
    } else {
      this.errorMessageSignal.set('');
    }
  };
}
