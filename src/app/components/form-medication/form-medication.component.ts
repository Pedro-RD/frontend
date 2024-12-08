// import {Component, Input, input, output} from '@angular/core';
import { Component } from '@angular/core';
import { input, output } from '@angular/core';
import { ButtonComponent } from '../forms/button/button.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../forms/input/input.component';
import { Medication } from '../../interfaces/medication';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-medication',
  standalone: true,
  imports: [
    ButtonComponent,
    FormsModule,
    InputComponent,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './form-medication.component.html',
})
export class FormMedicationComponent {
  selectedMedication?: Medication;
  isModalVisible = false;

  residentId = input.required<number>();

  initialData = input<Medication | undefined>(undefined);
  submit = output<Medication>();

  name = new FormControl<string>('', [Validators.required]);
  instructions = new FormControl<string>('');
  quantity = new FormControl<number | null>(null, [
    Validators.required,
    Validators.pattern(/^\d+$/),
  ]);
  prescriptionQuantity = new FormControl<number | null>(null, [
    Validators.required,
    Validators.pattern(/^\d+$/),
  ]);

  dueDate = new FormControl<Date | string>(new Date(), [Validators.required]);

  form: FormGroup = new FormGroup({
    name: this.name,
    instructions: this.instructions,
    quantity: this.quantity,
    prescriptionQuantity: this.prescriptionQuantity,
    dueDate: this.dueDate,
  });

  ngOnInit() {
    if (this.initialData()) {
      const data = this.initialData()!;
      this.name.setValue(data.name);
      this.instructions.setValue(data.instructions);
      this.quantity.setValue(data.quantity);
      this.prescriptionQuantity.setValue(data.prescriptionQuantity);
      const dueDateValue = new Date(data.dueDate);
      console.log('dueDateValue:', dueDateValue);
      if (!isNaN(dueDateValue.getTime())) {
        this.dueDate.setValue(
          new Date(data.dueDate).toISOString().substring(0, 10),
        );
        this.dueDate.updateValueAndValidity();
      } else {
        console.error('Invalid date format:', data.dueDate);
      }
    }
  }

  onSubmit() {
    console.log(
      'Form submitted:',
      this.form.value,
      this.form.valid,
      this.form.errors,
    );
    if (this.form.valid) {
      this.submit.emit({
        id: 0,
        name: this.name.value!,
        instructions: this.instructions.value!,
        quantity: this.quantity.value!,
        prescriptionQuantity: this.prescriptionQuantity.value!,
        dueDate: this.dueDate.value as Date,
      });
    }
  }
}
