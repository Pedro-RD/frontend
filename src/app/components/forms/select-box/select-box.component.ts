import { Component, computed, input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface SelectBoxData<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-select-box',
  standalone: true,
  imports: [],
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
    this.subject = this.control().valueChanges.subscribe(
      () => this.validate(),
    );
  }

  validate = () => {
    const control = this.control();

    if (control.invalid && control.touched) {
      this.showErrorSignal.set(true);
    } else {
      this.showErrorSignal.set(false);
    }
  };
}
