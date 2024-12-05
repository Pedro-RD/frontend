import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Medication } from '../../interfaces/medication';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-medication-administration',
  standalone: true,
  templateUrl: './medication-administration.component.html',
  imports: [
    DatePipe,
    FormsModule
  ],
  styleUrls: ['./medication-administration.component.css']
})
export class MedicationAdministrationComponent {
  @Input() medication?: Medication;
  @Output() close = new EventEmitter<void>();

  hour: string = '';
  dose: number = 0;

  onClose(): void {
    this.close.emit();
  }

  onAdminister(): void {
    // Lógica para administrar a medicação
    console.log(`Administrando medicação: ${this.medication?.name}, Hora: ${this.hour}, Dose: ${this.dose}`);
    this.onClose();
  }
}
