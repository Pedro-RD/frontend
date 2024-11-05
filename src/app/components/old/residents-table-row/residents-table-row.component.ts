import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Resident} from '../../../interfaces/resident';
import {NgForOf} from '@angular/common';

@Component({
  selector: '[app-residents-table-row]',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './residents-table-row.component.html',
  styleUrl: './residents-table-row.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResidentsTableRowComponent {
  @Input({required: true}) resident!: Resident;
  @Output() deleteResident = new EventEmitter<number>();

  handleDelete(): void {
    this.deleteResident.emit(this.resident.id);
  }

}
