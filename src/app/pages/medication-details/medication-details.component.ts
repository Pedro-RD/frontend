import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { MedicationService } from '../../services/medication/medication.service';
import { LoadingComponent } from '../../components/forms/loading/loading.component';
import { ModalConfirmComponent } from '../../components/forms/modal-confirm/modal-confirm.component';
import { Medication } from '../../interfaces/medication';
import { Administration } from '../../interfaces/administration';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MedicationAdministrationService } from '../../services/medicationAdministration/medication-administration.service';
import { InputComponent } from '../../components/forms/input/input.component';

@Component({
  selector: 'app-medication-details',
  templateUrl: './medication-details.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    NgIf,
    LoadingComponent,
    ModalConfirmComponent,
    ReactiveFormsModule,
    InputComponent,
  ],
})
export class MedicationDetailsComponent implements OnInit {
  medication?: Medication;
  error?: string;
  residentId?: string | null;
  isAdministrationModalVisible = false;
  showAddForm: any;
  newAdministration: Administration = { hour: '', dose: 0 };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private medicationService: MedicationService,
    private medicationAdministrationService: MedicationAdministrationService,
  ) {}

  doseControl = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(0),
  ]);

  hourControl = new FormControl<string | null>(null, [Validators.required]);

  administrationForm = new FormGroup({
    dose: this.doseControl,
    hour: this.hourControl,
  });

  ngOnInit(): void {
    this.residentId = this.route.snapshot.paramMap.get('residentId');
    const medicationId = this.route.snapshot.paramMap.get('id');

    if (this.residentId && medicationId) {
      this.medicationService
        .getMedicationById(this.residentId, medicationId)
        .subscribe({
          next: (medication) => {
            console.log(medication);
            this.medication = medication;
          },
          error: (err) => {
            this.error = 'Failed to load medication details';
          },
        });
    } else {
      this.error = 'Invalid route parameters';
    }
    this.hourControl.valueChanges.subscribe(() => {
      const result = this.validateNotSameHour();
      if (result) {
        this.hourControl.setErrors({ sameHour: true });
        console.log(this.hourControl.errors);
      }
    });
  }

  onDelete(): void {
    const medicationId = this.route.snapshot.paramMap.get('id');
    if (this.residentId && medicationId) {
      this.medicationService.delete(this.residentId, medicationId).subscribe({
        next: () => {
          this.router.navigate([`/residents/${this.residentId}/medicaments`]);
        },
        error: (err) => {
          this.error = 'Failed to delete medication';
        },
      });
    } else {
      this.error = 'Invalid route parameters';
    }
  }

  showAdministrationModal(): void {
    this.isAdministrationModalVisible = true;
  }

  onAddAdministration(): void {
    console.log(
      this.newAdministration,
      this.administrationForm.valid,
      this.hourControl.value,
    );
    if (this.administrationForm.valid && this.medication?.id) {
      this.medicationAdministrationService
        .addAdministration(this.medication.id, {
          hour: this.hourControl.value!,
          dose: parseInt(`${this.doseControl.value!}`),
        })
        .subscribe({
          next: (administration) => {
            console.log('Administração adicionada:', administration);
            this.medication!.medicamentAdministrations?.push({
              id: administration.id,
              hour: parseInt(`${administration.hour}`.split(':')[0]),
              minute: parseInt(`${administration.hour}`.split(':')[1]),
              dose: administration.dose,
            });
            this.administrationForm.reset();
            this.showAddForm = false;
          },
          error: (err) => {
            console.error('Erro ao adicionar administração:', err);
          },
        });
    } else {
      this.administrationForm.markAllAsTouched();
      this.administrationForm.markAsDirty();
      this.administrationForm.markAsTouched();
      this.administrationForm.updateValueAndValidity();
    }
  }

  onDeleteAdministration(administrationId: number): void {
    if (this.medication?.medicamentAdministrations && this.residentId) {
      this.medicationAdministrationService
        .deleteAdministration(this.medication.id, administrationId)
        .subscribe({
          next: () => {
            this.medication!.medicamentAdministrations =
              this.medication!.medicamentAdministrations?.filter(
                (admin) => admin.id !== administrationId,
              );
          },
          error: (err) => {
            console.error('Erro ao eliminar administração:', err);
          },
        });
    }
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  validateNotSameHour(): boolean {
    const hour = this.hourControl.value?.split(':')[0];
    const minute = this.hourControl.value?.split(':')[1];
    if (!hour || !minute) return true;
    const sameHour = this.medication?.medicamentAdministrations?.find(
      (admin) => {
        return (
          admin.hour === parseInt(hour) && admin.minute === parseInt(minute)
        );
      },
    );
    return !!sameHour;
  }

  pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  }
}
