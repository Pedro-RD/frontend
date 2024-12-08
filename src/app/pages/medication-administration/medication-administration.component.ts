// // import { Component, Input, OnInit } from '@angular/core';
// // import { MedicationAdministrationService } from '../../services/medicationAdministration/medication-administration.service';
// // import { CommonModule, NgIf } from '@angular/common';
// // import { FormsModule } from '@angular/forms';
// // import { Administration } from '../../interfaces/administration';
// // import {Medication} from '../../interfaces/medication';
// //
// // @Component({
// //   selector: 'app-medication-administration',
// //   standalone: true,
// //   templateUrl: './medication-administration.component.html',
// //   imports: [
// //     CommonModule,
// //     FormsModule,
// //     NgIf
// //   ],
// //   styleUrls: ['./medication-administration.component.css']
// // })
// // export class MedicationAdministrationComponent implements OnInit {
// //   administrations: Administration[] = [];
// //   medication?: Medication;
// //   @Input({ required: true }) medicationId!: number;
// //
// //   constructor(
// //     private medicationAdministrationService: MedicationAdministrationService
// //   ) {}
// //
// //   ngOnInit(): void {
// //     this.loadAdministrations();
// //   }
// //
// //   loadAdministrations(): void {
// //     this.medicationAdministrationService.getAdministrations(this.medicationId).subscribe({
// //       next: (administrations) => {
// //         this.administrations = administrations;
// //         console.log('Administrations loaded:', this.administrations);
// //       },
// //       error: (err) => {
// //         console.error('Failed to load administrations', err);
// //       }
// //     });
// //   }
// // }
//
//
//
//
//
// // import { Component, Input, OnInit } from '@angular/core';
// // import { MedicationAdministrationService } from '../../services/medicationAdministration/medication-administration.service';
// // import { CommonModule, NgIf } from '@angular/common';
// // import { FormsModule } from '@angular/forms';
// // import { Administration } from '../../interfaces/administration';
// // import {Medication} from '../../interfaces/medication';
// //
// // @Component({
// //   selector: 'app-medication-administration',
// //   standalone: true,
// //   templateUrl: './medication-administration.component.html',
// //   imports: [
// //     CommonModule,
// //     FormsModule,
// //     NgIf
// //   ],
// //   styleUrls: ['./medication-administration.component.css']
// // })
// // export class MedicationAdministrationComponent implements OnInit {
// //   administrations: Administration[] = [];
// //   @Input({ required: true }) medicationId!: number;
// //   medication?: Medication;
// //
// //   constructor(
// //     private medicationAdministrationService: MedicationAdministrationService
// //   ) {}
// //
// //   ngOnInit(): void {
// //     this.loadAdministrations();
// //   }
// //
// //   loadAdministrations(): void {
// //     console.log('Fetching administrations for medicationId:', this.medicationId);
// //     this.medicationAdministrationService.getAdministrations(this.medicationId).subscribe({
// //       next: (administrations) => {
// //         console.log('Raw API response:', administrations);
// //         this.administrations = administrations;
// //         console.log('Administrations loaded:', this.administrations);
// //       },
// //       error: (err) => {
// //         console.error('Failed to load administrations', err);
// //       }
// //     });
// //   }
// // }
//
//
//
//
//
//
// import { Component, Input, OnInit } from '@angular/core';
// import { MedicationAdministrationService } from '../../services/medicationAdministration/medication-administration.service';
// import { CommonModule, NgIf } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Administration } from '../../interfaces/administration';
// import { Medication } from '../../interfaces/medication';
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
//   @Input({ required: true }) residentId!: number;
//   @Input({ required: true }) medicationId!: number;
//   medication?: Medication;
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
//     console.log('Fetching administrations for residentId:', this.residentId, 'and medicationId:', this.medicationId);
//     this.medicationAdministrationService.getAdministrations(this.residentId, this.medicationId).subscribe({
//       next: (administrations) => {
//         console.log('Raw API response:', administrations);
//         this.administrations = administrations;
//         console.log('Administrations loaded:', this.administrations);
//       },
//       error: (err) => {
//         console.error('Failed to load administrations', err);
//       }
//     });
//   }
// }











// import { Component, Input, OnInit } from '@angular/core';
// import { MedicationAdministrationService } from '../../services/medicationAdministration/medication-administration.service';
// import { CommonModule, NgIf } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Administration } from '../../interfaces/administration';
// import { Medication } from '../../interfaces/medication';
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
//   @Input({ required: true }) residentId!: number;
//   @Input({ required: true }) medicationId!: number;
//   medication?: Medication;
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
//     console.log('Fetching administrations for residentId:', this.residentId, 'and medicationId:', this.medicationId);
//     this.medicationAdministrationService.getAdministrations(this.residentId, this.medicationId).subscribe({
//       next: (administrations) => {
//         console.log('Raw API response:', administrations);
//         this.administrations = administrations;
//         console.log('Administrations loaded:', this.administrations);
//       },
//       error: (err) => {
//         console.error('Failed to load administrations', err);
//       }
//     });
//   }
// }







// import { Component, Input, OnInit } from '@angular/core';
// import { Administration } from '../../interfaces/administration';
// import { MedicationAdministrationService } from '../../services/medicationAdministration/medication-administration.service';
//
// @Component({
//   selector: 'app-medication-administration',
//   templateUrl: './medication-administration.component.html',
//   standalone: true,
//   styleUrls: ['./medication-administration.component.css']
// })
// export class MedicationAdministrationComponent implements OnInit {
//   administrations: Administration[] = [];
//   @Input({ required: true }) residentId!: number;
//   @Input({ required: true }) medicationId!: number;
//
//   constructor(
//     private medicationAdministrationService: MedicationAdministrationService // Injeção do serviço
//   ) {}
//
//   ngOnInit(): void {
//     this.loadAdministrations();
//   }
//
//   loadAdministrations(): void {
//     this.medicationAdministrationService.getAdministrations(this.residentId, this.medicationId).subscribe({
//       next: (administrations) => {
//         this.administrations = administrations;
//       },
//       error: (err) => {
//         console.error('Failed to load administrations', err);
//       }
//     });
//   }
// }




import { Component, Input, OnInit } from '@angular/core';
import { Administration } from '../../interfaces/administration';
import { MedicationAdministrationService } from '../../services/medicationAdministration/medication-administration.service';

@Component({
  selector: 'app-medication-administration',
  templateUrl: './medication-administration.component.html',
  standalone: true,
  styleUrls: ['./medication-administration.component.css']
})
export class MedicationAdministrationComponent implements OnInit {
  administrations: Administration[] = [];
  @Input({ required: true }) residentId!: number;
  @Input({ required: true }) medicationId!: number;

  constructor(
    private medicationAdministrationService: MedicationAdministrationService // Injeção do serviço
  ) {}

  ngOnInit(): void {
    this.loadAdministrations();
  }

  loadAdministrations(): void {
    this.medicationAdministrationService.getAdministrations(this.residentId, this.medicationId).subscribe({
      next: (administrations) => {
        this.administrations = administrations;
      },
      error: (err) => {
        console.error('Failed to load administrations', err);
      }
    });
  }

  deleteAdministration(administrationId: number): void {
    this.medicationAdministrationService.deleteAdministration(this.residentId, this.medicationId, administrationId).subscribe({
      next: () => {
        this.administrations = this.administrations.filter(admin => admin.id !== administrationId);
      },
      error: (err) => {
        console.error('Failed to delete administration', err);
      }
    });
  }
}
