import { Component, Input, OnInit } from '@angular/core';
import { Administration } from '../../interfaces/administration';
import { MedicationAdministrationService } from '../../services/medicationAdministration/medication-administration.service';

@Component({
  selector: 'app-medication-administration',
  templateUrl: './medication-administration.component.html',
  standalone: true,
  styleUrls: ['./medication-administration.component.css'],
})
export class MedicationAdministrationComponent {
  administrations: Administration[] = [];
  @Input({ required: true }) residentId!: number;
  @Input({ required: true }) medicationId!: number;

  constructor(
    private medicationAdministrationService: MedicationAdministrationService, // Injeção do serviço
  ) {}

  deleteAdministration(administrationId: number): void {
    this.medicationAdministrationService
      .deleteAdministration(this.medicationId, administrationId)
      .subscribe({
        next: () => {
          this.administrations = this.administrations.filter(
            (admin) => admin.id !== administrationId,
          );
        },
        error: (err) => {
          console.error('Failed to delete administration', err);
        },
      });
  }
}
