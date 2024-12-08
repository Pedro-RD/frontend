import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { MedicationService } from '../../services/medication/medication.service';
import { LoadingComponent } from '../../components/forms/loading/loading.component';
import { ModalConfirmComponent } from '../../components/forms/modal-confirm/modal-confirm.component';
import { Medication } from '../../interfaces/medication';
import { Administration } from '../../interfaces/administration';
import { FormsModule } from '@angular/forms';
import { MedicationAdministrationService } from '../../services/medicationAdministration/medication-administration.service';

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
    FormsModule,
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
    if (this.medication?.medicamentAdministrations && this.residentId) {
      this.medicationAdministrationService
        .addAdministration(this.medication.id, this.newAdministration)
        .subscribe({
          next: (administration) => {
            this.medication?.medicamentAdministrations?.push(administration);
            this.newAdministration = { hour: '', dose: 0 };
            this.showAddForm = false;
          },
          error: (err) => {
            console.error('Erro ao adicionar administração:', err);
          },
        });
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
}
