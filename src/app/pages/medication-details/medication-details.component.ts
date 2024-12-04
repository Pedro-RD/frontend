import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import { Medication } from '../../interfaces/medication';
import { MedicationService } from '../../services/medication/medication.service';
import { DatePipe, NgIf } from '@angular/common';
import { LoadingComponent } from '../../components/forms/loading/loading.component';
import {ModalConfirmComponent} from '../../components/forms/modal-confirm/modal-confirm.component';
import {ButtonComponent} from '../../components/forms/button/button.component';


@Component({
  selector: 'app-medication-details',
  templateUrl: './medication-details.component.html',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    CommonModule,
    ModalConfirmComponent,
    LoadingComponent,
    NgIf,
    ButtonComponent,
  ],
  styleUrls: ['./medication-details.component.css']
})
export class MedicationDetailsComponent implements OnInit {
  medication?: Medication;
  error?: string;
  residentId?: string | null;

  constructor(
    private route: ActivatedRoute,
    private medicationService: MedicationService
  ) {}

  ngOnInit(): void {
    this.residentId = this.route.snapshot.paramMap.get('residentId');
    const medicationId = this.route.snapshot.paramMap.get('id');
    if (this.residentId && medicationId) {
      this.medicationService.getMedicationById(this.residentId, medicationId).subscribe(
        (medication) => this.medication = medication,
        (error) => this.error = error.message
      );
    } else {
      this.error = 'Invalid route parameters';
    }
  }

  showDeleteModal(): void {
    // Lógica para exibir modal de confirmação
  }

  onDelete(): void {
    // Lógica para deletar o medicamento
  }
}
