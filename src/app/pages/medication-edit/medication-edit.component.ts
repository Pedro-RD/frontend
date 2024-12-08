import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicationService } from '../../services/medication/medication.service';
import { Medication } from '../../interfaces/medication';
import { CommonModule, DatePipe } from '@angular/common';
import { FormMedicationComponent } from '../../components/form-medication/form-medication.component';

@Component({
  selector: 'app-medication-edit',
  templateUrl: './medication-edit.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormMedicationComponent],
  providers: [DatePipe],
})
export class MedicationEditComponent implements OnInit {
  residentId: string | null = null;
  medicationId: string | null = null;
  medication: Medication | null = null;
  error?: string;
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private medicationService: MedicationService,
  ) {}

  ngOnInit(): void {
    this.residentId = this.route.snapshot.paramMap.get('residentId');
    this.medicationId = this.route.snapshot.paramMap.get('id');

    if (this.residentId && this.medicationId) {
      this.medicationService
        .getMedicationById(this.residentId, this.medicationId)
        .subscribe({
          next: (medication: Medication) => {
            this.medication = medication;
          },
          error: (err) => {
            this.error = err.message;
          },
        });
    } else {
      this.error = 'Invalid route parameters';
    }
  }

  onSave(medication: Medication): void {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    if (this.residentId && this.medicationId) {
      this.medicationService
        .update(this.residentId, this.medicationId, medication)
        .subscribe({
          next: () => {
            this.isSubmitting = false;
            this.router.navigate([
              `/residents/${this.residentId}/medicaments/${this.medicationId}`,
            ]);
          },
          error: (err) => {
            this.isSubmitting = false;
            this.error = err.message;
          },
        });
    }
  }

  onCancel(): void {
    if (this.residentId) {
      this.router.navigate([`/residents/${this.residentId}/medicaments`]);
    }
  }
}
