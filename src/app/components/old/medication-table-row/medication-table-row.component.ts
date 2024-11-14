import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Medication} from '../../../interfaces/medication';
import {NgForOf} from '@angular/common';

@Component({
  selector: '[app-medication-table-row]',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './medication-table-row.component.html',
  styleUrl: './medication-table-row.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MedicationTableRowComponent {
  @Input({required: true}) medication!: Medication;
  @Output() deleteMedication = new EventEmitter<number>();

  handleDelete(): void {
    this.deleteMedication.emit(this.medication.id);
  }

}
