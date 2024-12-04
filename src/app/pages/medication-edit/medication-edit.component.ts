import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MedicationService } from '../../services/medication/medication.service';
import { Medication } from '../../interfaces/medication';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { LoadingComponent } from '../../components/forms/loading/loading.component';
import { ModalConfirmComponent } from '../../components/forms/modal-confirm/modal-confirm.component';
import { ButtonComponent } from '../../components/forms/button/button.component';

@Component({
  selector: 'app-medication-edit',
  templateUrl: './medication-edit.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    ModalConfirmComponent,
    LoadingComponent,
    NgIf,
    ButtonComponent,
  ],
  styleUrls: ['./medication-edit.component.css'],
  providers: [DatePipe]
})
export class MedicationEditComponent implements OnInit {
  medicationForm: FormGroup;
  residentId: string | null = null;
  medicationId: string | null = null;
  error?: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private medicationService: MedicationService,
    private datePipe: DatePipe
  ) {
    this.medicationForm = this.fb.group({
      name: ['', Validators.required],
      instructions: [''],
      quantity: ['', Validators.required],
      prescriptionQuantity: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.residentId = this.route.snapshot.paramMap.get('residentId');
    this.medicationId = this.route.snapshot.paramMap.get('id');

    if (this.residentId && this.medicationId) {
      this.medicationService.getMedicationById(this.residentId, this.medicationId).subscribe({
        next: (medication: Medication) => {
          const formattedDueDate = this.datePipe.transform(medication.dueDate, 'yyyy-MM-dd');
          this.medicationForm.patchValue({
            ...medication,
            dueDate: formattedDueDate
          });
        },
        error: (err) => {
          this.error = err.message;
        }
      });
    } else {
      this.error = 'Invalid route parameters';
    }
  }

  onSave(): void {
    if (this.medicationForm.valid && this.residentId && this.medicationId) {
      const medication: Medication = {
        ...this.medicationForm.value,
        dueDate: new Date(this.medicationForm.value.dueDate)
      };
      this.medicationService.update(this.residentId, this.medicationId, medication).subscribe({
        next: () => {
          this.router.navigate([`/residents/${this.residentId}/medicaments`]);
        },
        error: (err) => {
          this.error = err.message;
        }
      });
    }
  }

  onCancel(): void {
    if (this.residentId) {
      this.router.navigate([`/residents/${this.residentId}/medicaments`]);
    }
  }
}
