import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { MedicationService } from '../../services/medication/medication.service';
import { LoadingComponent } from '../../components/forms/loading/loading.component';
import { ModalConfirmComponent } from '../../components/forms/modal-confirm/modal-confirm.component';
import { ButtonComponent } from '../../components/forms/button/button.component';
import { MedicationAdministrationComponent } from '../medication-administration/medication-administration.component';
import {Medication} from '../../interfaces/medication';
import { Administration } from '../../interfaces/administration';

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
    ButtonComponent,
    MedicationAdministrationComponent,
  ],
  styleUrls: ['./medication-details.component.css']
})
export class MedicationDetailsComponent implements OnInit {
  medication?: Medication;
  error?: string;
  residentId?: string | null;
  isAdministrationModalVisible = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private medicationService: MedicationService
  ) {}

  ngOnInit(): void {
    this.residentId = this.route.snapshot.paramMap.get('residentId');
    const medicationId = this.route.snapshot.paramMap.get('id');

    if (this.residentId && medicationId) {
      this.medicationService.getMedicationById(this.residentId, medicationId).subscribe({
        next: (medication) => {
          console.log(medication);
          this.medication = medication;
        },
        error: (err) => {
          this.error = 'Failed to load medication details';
        }
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
        }
      });
    } else {
      this.error = 'Invalid route parameters';
    }
  }

  showAdministrationModal(): void {
    this.isAdministrationModalVisible = true;
  }

  closeAdministrationModal(): void {
    this.isAdministrationModalVisible = false;
  }

  showDeleteModal() {
    // Implement the logic for showing the delete modal
  }

  trackById(index: number, item: any): number {
    return item.id;
  }

  onAddAdministration() {
    if (this.medication) {
      const newAdministration: Administration = {
        id: Date.now(), // ou outro método para gerar um ID único
        hour: '00:00', // valor padrão ou lógica para definir a hora
        dose: 0 // valor padrão ou lógica para definir a dose
      };
      this.medication.medicamentAdministrations = [
        ...this.medication.medicamentAdministrations || [],
        newAdministration
      ];
    }
  }

  onDeleteAdministration(id: number | undefined) {
    if (this.medication && id !== undefined) {
      this.medication.medicamentAdministrations = this.medication.medicamentAdministrations?.filter(
        admin => admin.id !== id
      );
    }
  }
}
