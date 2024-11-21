import {Component, input, output} from '@angular/core';
import {ButtonComponent} from "../forms/button/button.component";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputComponent} from "../forms/input/input.component";
import {Medication} from '../../interfaces/medication';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-form-medication',
  standalone: true,
  imports: [
    ButtonComponent,
    FormsModule,
    InputComponent,
    ReactiveFormsModule
  ],
  templateUrl: './form-medication.component.html',
  styleUrl: './form-medication.component.css'
})
export class FormMedicationComponent {
  initialData = input<Medication | undefined>();
  createRequested = output<Medication>();
  name = new FormControl<string>('', [Validators.required]);
  instructions = new FormControl<string>('');
  quantity = new FormControl<number | null>(null, [Validators.required, Validators.pattern(/^\d+$/)]);
  prescriptionQuantity = new FormControl<number | null>(null, [Validators.required, Validators.pattern(/^\d+$/)]);
  dueDate = new FormControl<Date>( new Date(),[Validators.required]);


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
      this.dueDate.setValue(new Date(data.dueDate));
    }
  }

  onSubmit() {
    console.log('Form submitted:', this.form.value, this.form.valid, this.form.errors);
    if (this.form.valid) {
      this.createRequested.emit({
        id: 0,
        name: this.name.value!,
        instructions: this.instructions.value!,
        quantity: this.quantity.value!,
        prescriptionQuantity: this.prescriptionQuantity.value!,
        dueDate: this.dueDate.value!,
      });
    }
  }
  protected readonly environment = environment;
}
