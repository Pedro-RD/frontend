// // src/app/pages/medication-administration/medication-administration.component.ts
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { MedicationService } from '../../services/medication/medication.service';
// import { Medication } from '../../interfaces/medication';
// import {DatePipe} from '@angular/common';
//
// @Component({
//   selector: 'app-medication-administration',
//   standalone: true,
//   templateUrl: './medication-administration.component.html',
//   imports: [
//     DatePipe
//   ],
//   styleUrls: ['./medication-administration.component.css']
// })
// export class MedicationAdministrationComponent implements OnInit {
//   medication?: Medication;
//   residentId?: string | null;
//
//   constructor(
//     private route: ActivatedRoute,
//     private medicationService: MedicationService
//   ) {}
//
//   ngOnInit(): void {
//     this.residentId = this.route.snapshot.paramMap.get('residentId');
//     const medicationId = this.route.snapshot.paramMap.get('id');
//
//     if (this.residentId && medicationId) {
//       this.medicationService.getMedicationById(this.residentId, medicationId).subscribe({
//         next: (medication) => {
//           this.medication = medication;
//         },
//         error: (err) => {
//           console.error('Failed to load medication details', err);
//         }
//       });
//     }
//   }
//
//   onAdminister(): void {
//     // Lógica para administrar a medicação
//   }
// }


import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Medication } from '../../interfaces/medication';

@Component({
  selector: 'app-medication-administration',
  templateUrl: './medication-administration.component.html',
  standalone: true,
  styleUrls: ['./medication-administration.component.css']
})
export class MedicationAdministrationComponent {
  @Input() medication?: Medication;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onAdminister(): void {
    // Lógica para administrar a medicação
    this.onClose();
  }
}
