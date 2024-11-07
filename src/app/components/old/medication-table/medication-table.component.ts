import {NgForOf} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MedicationService} from '../../../services/medication/medication.service';
import {MedicationTableRowComponent} from '../medication-table-row/medication-table-row.component';

@Component({
  selector: 'app-medication-table',
  standalone: true,
  imports: [NgForOf, MedicationTableRowComponent],
  templateUrl: './medication-table.component.html',
  styleUrl: './medication-table.component.css',
})
export class MedicationTableComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  // medication = computed(() => this.medicationService.listSignal());

  constructor(private medicationService: MedicationService) {
  }

  ngOnInit() {
    this.updateTable()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.medicationService.clearAll();
  }

  handleHeaderClick(col: string) {
    this.medicationService.setOrderBy(col);
    this.updateTable();
  }

  updateTable() {
    // this.subscriptions.push(this.medicationService.fetchList().subscribe());
  }

  deleteResident($event: number) {
    this.subscriptions.push(this.medicationService.delete($event).subscribe())
  }
}
