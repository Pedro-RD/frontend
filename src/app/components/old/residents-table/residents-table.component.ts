import {NgForOf} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ResidentsService} from '../../../services/residents/residents.service';
import {ResidentsTableRowComponent} from '../residents-table-row/residents-table-row.component';

@Component({
  selector: 'app-residents-table',
  standalone: true,
  imports: [NgForOf, ResidentsTableRowComponent],
  templateUrl: './residents-table.component.html',
  styleUrl: './residents-table.component.css',
})
export class ResidentsTableComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  // residents = computed(() => this.residentsService.listSignal());

  constructor(private residentsService: ResidentsService) {
  }

  ngOnInit() {
    this.updateTable()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.residentsService.clearAll();
  }

  handleHeaderClick(col: string) {
    this.residentsService.setOrderBy(col);
    this.updateTable();
  }

  updateTable() {
    // this.subscriptions.push(this.residentsService.fetchList().subscribe());
  }

  deleteResident($event: number) {
    this.subscriptions.push(this.residentsService.delete($event).subscribe())
  }
}
