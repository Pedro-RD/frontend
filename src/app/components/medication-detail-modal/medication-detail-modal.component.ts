import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';


@Component({
  selector: 'app-medication-detail-modal',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './medication-detail-modal.component.html',
  styleUrl: './medication-detail-modal.component.css'
})
export class MedicationDetailModalComponent {
  showModal=false;

  closeModal(): void {
    this.showModal = false;
  }

  openModal(): void {
    this.showModal = true;
  }
}
