import { Component, computed, input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent<T> implements OnInit, OnDestroy {
  label = input.required<string>();
  placeholder = input.required<string>();
  type = input<string>();
  required = input<boolean>();
  control = input.required<FormControl<T>>();
  showErrorSignal = signal<boolean>(false);
  showError = computed(() => {
    return this.showErrorSignal();
  });

  errorMessageSignal = signal<string>('');
  errorMessage = computed(() => this.errorMessageSignal());

  subscription?: Subscription;

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.control().valueChanges.subscribe(
      {
        next: (value) => {
          this.updateValidation();
        },
        error: (err) => {
          if (!environment.production) console.error('Input validation error', err);
        },
      },
    );
  }

  private updateValidation = () => {
    const control = this.control();
    console.log(this.control, control.invalid);
    this.showErrorSignal.set(control.invalid);
    console.log('EMAIL: ', control.errors?.['email']);

    if (control.errors?.['required']) {
      this.errorMessageSignal.set('This field is required');
    } else if (control.errors?.['email']) {
      this.errorMessageSignal.set('Please enter a valid email');
    } else if (control.errors?.['minlength']) {
      this.errorMessageSignal.set(`Minimum length is ${control.errors['minlength'].requiredLength}`);
    } else if (control.errors?.['maxlength']) {
      this.errorMessageSignal.set(`Maximum length is ${control.errors['maxlength'].requiredLength}`);
    } else if (control.errors?.['pattern']) {
      this.errorMessageSignal.set('Invalid format');
    } else {
      this.errorMessageSignal.set('');
    }
  };
}
