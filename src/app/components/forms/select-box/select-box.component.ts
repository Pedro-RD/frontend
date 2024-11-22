import { Component, computed, Input, input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface SelectBoxData<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-select-box',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './select-box.component.html',
  styleUrl: './select-box.component.css',
})
export class SelectBoxComponent<T> implements OnInit, OnDestroy {
  data = input.required<SelectBoxData<T>[]>();
  control = input.required<FormControl<T>>();
  label = input<string>('');
  showErrorSignal = signal<boolean>(false);
  showError = computed(() => this.showErrorSignal());


  subject?: Subscription;

  ngOnDestroy(): void {
    this.subject?.unsubscribe();
  }

  ngOnInit(): void {
    // Set initial validation state
    this.validate();

    this.subject = this.control().valueChanges.subscribe(() => {
      this.control().markAsTouched();
      this.validate();
    });
  }

  validate = () => {
    const control = this.control();
    const value = control.value;

    if (!value || value === '') {
      control.setErrors({ required: true });
    } else {
      control.setErrors(null);
    }

    this.showErrorSignal.set(control.errors?.['required'] && control.touched);
  };
}
