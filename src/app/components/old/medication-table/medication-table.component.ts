import { NgForOf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MedicationService } from '../../../services/medication/medication.service';
import { MedicationTableRowComponent } from '../medication-table-row/medication-table-row.component';

@Component({
  selector: 'app-medication-table',
  standalone: true,
  imports: [NgForOf, MedicationTableRowComponent],
  templateUrl: './medication-table.component.html',
  styleUrls: ['./medication-table.component.css'],
})
export class MedicationTableComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  medicamentos: any[] = [];

  constructor(private medicationService: MedicationService) {}

  ngOnInit() {
    this.updateTable();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.medicationService.clearAll(); // Caso exista um método para limpar dados no serviço
  }

  handleHeaderClick(col: string) {
    this.medicationService.setOrderBy(col); // Implemente a lógica no serviço para definir a ordenação
    this.updateTable();
  }

  updateTable() {
    this.subscriptions.push(this.medicationService.fetchList().subscribe((data) => {
      this.medicamentos = data;
    }));
  }

  deleteMedication($event: number) {
    this.subscriptions.push(this.medicationService.delete($event).subscribe(() => {
      this.updateTable(); // Atualiza a tabela após exclusão
    }));
  }
}
