// import { Component, Input, OnInit } from '@angular/core';
// import { MedicationAdministrationService } from '../../services/medicationAdministration/medication-administration.service';
// import { CommonModule, NgIf } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Administration } from '../../interfaces/administration';
// import {Medication} from '../../interfaces/medication';
//
// @Component({
//   selector: 'app-medication-administration',
//   standalone: true,
//   templateUrl: './medication-administration.component.html',
//   imports: [
//     CommonModule,
//     FormsModule,
//     NgIf
//   ],
//   styleUrls: ['./medication-administration.component.css']
// })
// export class MedicationAdministrationComponent implements OnInit {
//   administrations: Administration[] = [];
//   medication?: Medication;
//   @Input({ required: true }) medicationId!: number;
//
//   constructor(
//     private medicationAdministrationService: MedicationAdministrationService
//   ) {}
//
//   ngOnInit(): void {
//     this.loadAdministrations();
//   }
//
//   loadAdministrations(): void {
//     this.medicationAdministrationService.getAdministrations(this.medicationId).subscribe({
//       next: (administrations) => {
//         this.administrations = administrations;
//         console.log('Administrations loaded:', this.administrations);
//       },
//       error: (err) => {
//         console.error('Failed to load administrations', err);
//       }
//     });
//   }
// }

import { Component, Input, OnInit } from '@angular/core';
import { MedicationAdministrationService } from '../../services/medicationAdministration/medication-administration.service';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Administration } from '../../interfaces/administration';
import {Medication} from '../../interfaces/medication';

@Component({
  selector: 'app-medication-administration',
  standalone: true,
  templateUrl: './medication-administration.component.html',
  imports: [
    CommonModule,
    FormsModule,
    NgIf
  ],
  styleUrls: ['./medication-administration.component.css']
})
export class MedicationAdministrationComponent implements OnInit {
  administrations: Administration[] = [];
  @Input({ required: true }) medicationId!: number;
  medication?: Medication;

  constructor(
    private medicationAdministrationService: MedicationAdministrationService
  ) {}

  ngOnInit(): void {
    this.loadAdministrations();
  }

  loadAdministrations(): void {
    console.log('Fetching administrations for medicationId:', this.medicationId);
    this.medicationAdministrationService.getAdministrations(this.medicationId).subscribe({
      next: (administrations) => {
        console.log('Raw API response:', administrations);
        this.administrations = administrations;
        console.log('Administrations loaded:', this.administrations);
      },
      error: (err) => {
        console.error('Failed to load administrations', err);
      }
    });
  }
}
