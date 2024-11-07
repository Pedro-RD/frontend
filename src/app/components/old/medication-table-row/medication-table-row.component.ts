import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MedicationService } from '../../services/medication.service';

@Component({
  selector: 'app-medication-table',
  templateUrl: './medication-table.component.html',
  styleUrls: ['./medication-table.component.css']
})
export class MedicationTableComponent implements OnInit {
  medicamentos = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private medicationService: MedicationService) {}

  ngOnInit(): void {
    this.loadMedications();
  }

  loadMedications() {
    this.medicationService.getMedications().subscribe(data => {
      this.medicamentos = data;
    });
  }

  handleHeaderClick(column: string) {
    // Implement sorting functionality based on column clicked
  }
}
