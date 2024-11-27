import { Component } from '@angular/core';
import {ButtonComponent} from "../../components/forms/button/button.component";
import {Input, input, output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Medication} from '../../interfaces/medication';
import {environment} from '../../../environments/environment';
import {RouterLink} from '@angular/router';
import {InputComponent} from '../../components/forms/input/input.component';
// import {MedicationDetailModalComponent} from '../medication-detail-modal/medication-detail-modal.component';

@Component({
  selector: 'app-medication-details',
  standalone: true,
  imports: [
    ButtonComponent,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    InputComponent,
  ],
  templateUrl: './medication-details.component.html',
  styleUrl: './medication-details.component.css'
})

export class MedicationDetailsComponent {
  selectedMedication?: Medication;
  isModalVisible = false;

  @Input() residentId?: number;

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
