import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HealthReportDTO } from '../../interfaces/health-report';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from '../../../environments/environment';
import { InputComponent } from '../forms/input/input.component';
import { ButtonComponent } from '../forms/button/button.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-form-health-report',
  standalone: true,
  imports: [InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './form-health-report.component.html',
  styleUrls: ['./form-health-report.component.css'],
})
export class FormHealthReportComponent implements OnInit {
  @Input() initialData: HealthReportDTO | undefined;
  @Output() createRequested = new EventEmitter<HealthReportDTO>();

  constructor(private location: Location) {}

  arterialBloodPressure = new FormControl<string>('', [Validators.required, Validators.pattern(/^\d+\/\d+$/)],);
  temperature = new FormControl<number | null>(null, [Validators.required]);
  height = new FormControl<number | null>(null, [Validators.required]);
  weight = new FormControl<number | null>(null, [Validators.required]);
  respiratoryRate = new FormControl<number | null>(null, [Validators.required]);
  heartRate = new FormControl<number | null>(null, [Validators.required]);
  bloodGlucoseLevel = new FormControl<number | null>(null, [
    Validators.required,
  ]);
  mobility = new FormControl<string>('', [Validators.required, Validators.maxLength(255)]);
  hydrationLevel = new FormControl<string>('', [Validators.required, Validators.maxLength(255)]);
  cognitiveEmotionalAssessment = new FormControl<string>('', [
    Validators.required,
    Validators.maxLength(255),
  ]);
  bloodOxygenLevel = new FormControl<number | null>(null, [
    Validators.required,
  ]);

  form: FormGroup = new FormGroup({
    arterialBloodPressure: this.arterialBloodPressure,
    temperature: this.temperature,
    height: this.height,
    weight: this.weight,
    respiratoryRate: this.respiratoryRate,
    heartRate: this.heartRate,
    bloodGlucoseLevel: this.bloodGlucoseLevel,
    mobility: this.mobility,
    hydrationLevel: this.hydrationLevel,
    cognitiveEmotionalAssessment: this.cognitiveEmotionalAssessment,
    bloodOxygenLevel: this.bloodOxygenLevel,
  });

  ngOnInit() {
    if (this.initialData) {
      const data = this.initialData!;
      this.arterialBloodPressure.setValue(data.arterialBloodPressure);
      this.temperature.setValue(data.temperature);
      this.height.setValue(data.height);
      this.weight.setValue(data.weight);
      this.respiratoryRate.setValue(data.respiratoryRate);
      this.heartRate.setValue(Number(data.heartRate));
      this.bloodGlucoseLevel.setValue(data.bloodGlucoseLevel);
      this.mobility.setValue(data.mobility);
      this.hydrationLevel.setValue(data.hydrationLevel);
      this.cognitiveEmotionalAssessment.setValue(
        data.cognitiveEmotionalAssessment,
      );
      this.bloodOxygenLevel.setValue(data.bloodOxygenLevel);
    }
  }

  onSubmit() {
    if (environment)
      console.log(
        'Form submitted:',
        this.form.value,
        this.form.valid,
        this.form.errors,
      );
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.createRequested.emit({
      arterialBloodPressure: this.arterialBloodPressure.value!,
      temperature: parseFloat(`${this.temperature.value!}`),
      height: parseFloat(`${this.height.value}`),
      weight: parseFloat(`${this.weight.value!}`),
      respiratoryRate: parseInt(`${this.respiratoryRate.value!}`),
      heartRate: parseInt(`${this.heartRate.value!}`),
      bloodGlucoseLevel: parseInt(`${this.bloodGlucoseLevel.value!}`),
      mobility: this.mobility.value!,
      hydrationLevel: this.hydrationLevel.value!,
      cognitiveEmotionalAssessment: this.cognitiveEmotionalAssessment.value!,
      bloodOxygenLevel: parseFloat(`${this.bloodOxygenLevel.value!}`),
    });
  }

  protected readonly environment = environment;

  goBack() {
    this.location.back();
  }
}
