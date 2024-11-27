import { Component, computed, Input, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgClass, NgForOf, NgIf } from '@angular/common';

export interface SelectBoxData<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-select-box-multiple',
  standalone: true,
  imports: [ReactiveFormsModule, NgForOf, NgIf, NgClass],
  templateUrl: './select-box-multiple.component.html',
  styleUrls: ['./select-box-multiple.component.css'],
})
export class SelectBoxMultipleComponent {
  data = input.required<SelectBoxData<number>[]>();
  control = input.required<FormControl<number[] | null>>(); // Exclusivamente array de números
  label = input<string>('');
  showErrorSignal = signal<boolean>(false);
  showError = computed(() => this.showErrorSignal());
  required = input<boolean>(false);
  subject?: Subscription;

  filteredData: SelectBoxData<number>[] = []; // Opções filtradas
  isDropdownOpen = false; // Estado da dropdown

  ngOnDestroy(): void {
    this.subject?.unsubscribe();
  }

  ngOnInit(): void {
    // Inicializar as opções filtradas com todas as opções disponíveis
    this.filteredData = this.data();

    // Inicializar validação
    this.validate();

    this.subject = this.control().valueChanges.subscribe(() => {
      this.control().markAsTouched();
      this.validate();
    });
  }

  validate = () => {
    const control = this.control();
    const value = control.value;

    if (!value || value.length === 0) {
      control.setErrors({ required: true });
    } else {
      control.setErrors(null);
    }

    this.showErrorSignal.set(control.errors?.['required'] && control.touched);
  };

  isChecked(value: number): boolean {
    const control = this.control();
    return control.value?.includes(value) || false;
  }

  onCheckboxChange(value: number, event: Event): void {
    const control = this.control();
    const currentValue = control.value || [];
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      control.setValue([...currentValue, value]); // Adicionar ao array
    } else {
      control.setValue(currentValue.filter(v => v !== value)); // Remover do array
    }

    control.markAsDirty();
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredData = this.data().filter(item =>
      item.label.toLowerCase().includes(query)
    );
  }

  trackByValue(index: number, item: SelectBoxData<number>): number {
    return item.value;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;

    if (this.isDropdownOpen) {
      // Resetar filtro ao abrir o dropdown
      this.filteredData = this.data();
    }
  }

}
