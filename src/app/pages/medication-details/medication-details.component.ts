import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Medication } from '../../interfaces/medication';
import { MedicationService } from '../../services/medication/medication.service';
import { ModalConfirmComponent } from '../../components/forms/modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-medication-details',
  templateUrl: './medication-details.component.html',
  standalone: true,
  styleUrls: ['./medication-details.component.css']
})
export class MedicationDetailsComponent implements OnInit {
  medication?: Medication;
  error?: string;
  residentId?: string | null;
  isAdministrationModalVisible = false;
  @ViewChild(ModalConfirmComponent) deleteModal!: ModalConfirmComponent;

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
          this.medication = medication;
        },
        error: (err) => {
          this.error = 'Failed to load medication details';
        }
      });
    } else {
      this.error = 'Invalid resident or medication ID';
    }
  }

  onDelete(): void {
    const medicationId = this.route.snapshot.paramMap.get('id');
    if (this.residentId && medicationId) {
      this.medicationService.delete(this.residentId, medicationId).subscribe({
        next: () => {
          this.router.navigate(['/residents', this.residentId, 'medicaments']);
        },
        error: (err) => {
          this.error = 'Failed to delete medication';
        }
      });
    }
  }

  showAdministrationModal = false; // Controla a visibilidade da modal

  openAdministrationModal(): void {
    this.showAdministrationModal = true;
  }

  closeAdministrationModal(): void {
    this.showAdministrationModal = false;
  }

  showDeleteModal(): void {
    this.deleteModal.show();
  }

  openAdministrationModal(): void {
    this.isAdministrationModalVisible = true;
  }

  closeAdministrationModal(): void {
    this.isAdministrationModalVisible = false;
  }
}
