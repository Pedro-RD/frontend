import { Component, input, OnInit, output } from '@angular/core';
import { AppointmentDTO } from '../../interfaces/appointment';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentStatus } from '../../interfaces/appointment-status.enum';
import { AppointmentType } from '../../interfaces/appointment-type.enum';
import { environment } from '../../../environments/environment';
import { InputComponent } from '../forms/input/input.component';
import { AutoCompleteComponent } from '../forms/auto-complete/auto-complete.component';
import { SelectBoxComponent } from '../forms/select-box/select-box.component';
import { ButtonComponent } from '../forms/button/button.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-form-residents-appointment',
  standalone: true,
  imports: [
    InputComponent,
    AutoCompleteComponent,
    SelectBoxComponent,
    ButtonComponent,
    ReactiveFormsModule,

  ],
  templateUrl: './form-residents-appointment.component.html',
  styleUrl: './form-residents-appointment.component.css'
})
export class FormResidentsAppointmentComponent implements OnInit {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  initialData = input<AppointmentDTO | undefined>();
  createRequested = output<AppointmentDTO>();

  title = new FormControl<string>('', [Validators.required]);
  type = new FormControl<AppointmentType | ''>('', [Validators.required]);
  status = new FormControl<AppointmentStatus | ''>('', [Validators.required]);
  start = new FormControl<string>(new Date().toISOString().substring(0, 16), [Validators.required]);
  observation = new FormControl<string | undefined>(undefined, [Validators.required]);


  form: FormGroup = new FormGroup({
    title: this.title,
    type: this.type,
    status: this.status,
    start: this.start,
    observation: this.observation,
  });

  types = Object.values(AppointmentType).map(types => ({
    value: types,
    label: String(types).charAt(0).toUpperCase() + String(types).slice(1),
  }));

  statuses = Object.values(AppointmentStatus).map(status => ({
    value: status,
    label: String(status).charAt(0).toUpperCase() + String(status).slice(1),
  }));

  ngOnInit() {
    if (this.initialData()) {
      const data = this.initialData()!;
      this.title.setValue(data.title);
      this.type.setValue(data.type);
      this.status.setValue(data.status);
      this.start.setValue(new Date(data.start).toISOString().substring(0, 16));
      this.observation.setValue(data.observation);
    }
  }

  onSubmit() {
    console.log('Form submitted:', this.form.value, this.form.valid, this.form.errors);
    if (this.form.valid) {
      this.createRequested.emit({
        title: this.title.value!,
        type: this.type.value! as AppointmentType,
        status: this.status.value! as AppointmentStatus,
        start: new Date(this.start.value!),
        observation: this.observation.value!,
      });
    }
  }
  protected readonly environment = environment;

}


