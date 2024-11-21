import {Component, computed, input, OnInit, output, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterModule} from '@angular/router';
import {Medication} from '../../interfaces/medication';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';


@Component({
  selector: 'app-medication-create',
  standalone: true,
  imports: [
    RouterModule,
  ],
  templateUrl: './medication-create.component.html',
  styleUrl: './medication-create.component.css'
})
export class MedicationCreateComponent implements OnInit {
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
