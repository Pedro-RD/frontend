import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Medication, MedicationDTO } from '../../interfaces/medication';
import { MedicationService } from '../../services/medication/medication.service';
import { FormMedicationComponent } from '../../components/form-medication/form-medication.component';

@Component({
  selector: 'app-medication-create',
  standalone: true,
  imports: [RouterModule, FormMedicationComponent],
  templateUrl: './medication-create.component.html',
})
export class MedicationCreateComponent implements OnDestroy {
  medicationCreateSub: Subscription | undefined;
  private isSubmitting = false;
  private submitQueue = new Subject<Medication>();
  private submitSub: Subscription;
  residentId: number;

  constructor(
    private medicationService: MedicationService,
    private router: Router,
    public route: ActivatedRoute,
  ) {
    this.residentId = parseInt(
      this.route.snapshot.paramMap.get('residentId') || '0',
      10,
    );
    this.submitSub = this.submitQueue.subscribe({
      next: () =>
        this.router.navigate([`/residents/${this.residentId}/medicaments`]),
      error: (err) => console.error(err),
    });
  }

  ngOnDestroy() {
    this.submitQueue.complete();
    this.submitSub.unsubscribe();
  }

  onFormSubmit(medicationDTO: MedicationDTO) {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    const medication: Medication = {
      ...medicationDTO,
      id: 0,
      quantity: parseInt(String(medicationDTO.quantity)),
      prescriptionQuantity: parseInt(
        String(medicationDTO.prescriptionQuantity),
      ),
    };
    this.medicationCreateSub = this.medicationService
      .create(this.residentId, medication)
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate([`/residents/${this.residentId}/medicaments`]);
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error(err);
        },
      });
  }
}
