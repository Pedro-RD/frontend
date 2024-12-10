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
    this.showErrorSignal.set(control.invalid && control.touched);

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
    } else if (control.errors?.['min']) {
      this.errorMessageSignal.set(
        `O valor mínimo é ${control.errors?.['min'].min}`,
      );
    } else if (control.errors?.['max']) {
      this.errorMessageSignal.set(
        `O valor máximo é ${control.errors?.['max'].max}`,
      );
    } else {
      this.errorMessageSignal.set('');
    }
  };

  get message() {
    if (!this.control().invalid) return '';
    if (this.control().errors?.['required']) {
      return 'Este campo é obrigatório';
    } else if (this.control().errors?.['email']) {
      return 'Por favor, introduza um email válido';
    } else if (this.control().errors?.['minlength']) {
      return `O comprimento mínimo é ${
        this.control().errors?.['minlength'].requiredLength
      }`;
    } else if (this.control().errors?.['maxlength']) {
      return `O comprimento máximo é ${
        this.control().errors?.['maxlength'].requiredLength
      }`;
    } else if (this.control().errors?.['pattern']) {
      return 'Formato inválido';
    } else if (this.control().errors?.['min']) {
      return `O valor mínimo é ${this.control().errors?.['min'].min}`;
    } else if (this.control().errors?.['max']) {
      return `O valor máximo é ${this.control().errors?.['max'].max}`;
    } else if (this.control().errors?.['passwordMismatch']) {
      return 'As palavras-passe não coincidem';
    } else if (this.control().errors?.['salaryTooLow']) {
      return 'O salário não pode ser inferior a 820€ (salário mínimo)';
    } else if (this.control().errors?.['contractEndsBeforeStart']) {
      return 'A data de fim do contrato não pode ser anterior à data de início';
    } else if (this.control().errors?.['futureDate']) {
      return 'A data tem de ser no futuro';
    } else if (this.control().errors?.['pastDate']) {
      return 'A data tem de ser no passado';
    }
    return 'Por favor, introduza um valor válido';
  }
}
