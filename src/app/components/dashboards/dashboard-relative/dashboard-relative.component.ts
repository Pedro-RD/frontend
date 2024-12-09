import { Component, OnInit } from '@angular/core';
import { ManagerDashboardService } from '../../../services/managerDashboard/manager-dashboard.service';
import { catchError, of, tap } from 'rxjs';
import { DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard-relative',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    DatePipe,
    NgClass,
    NgOptimizedImage,
  ],
  templateUrl: './dashboard-relative.component.html',
  styleUrls: ['./dashboard-relative.component.css'], // Fixed 'styleUrl' to 'styleUrls'
})
export class DashboardRelativeComponent implements OnInit {
  isLoading = true;
  residents: any[] = [];
  flippedIndex: number | null = null; // Tracks the currently flipped card
  photoResidentUrl = environment.photoResident;

  constructor(private managerDashboardService: ManagerDashboardService, private router: Router) {}

  private loadDashboardData() {
    this.managerDashboardService.getRelativeDashboard().pipe(
      tap((data) => {
        this.residents = data; // Directly assign the data
        this.isLoading = false; // Turn off loading
      }),
      catchError((error) => {
        console.error('Error fetching data:', error);
        this.isLoading = false; // Turn off loading even on error
        return of([]); // Return an empty array on error
      })
    ).subscribe();
  }

  ngOnInit() {
    this.loadDashboardData(); // Call the method on component initialization
  }

  toggleFlip(index: number): void {
    this.flippedIndex = this.flippedIndex === index ? null : index; // Toggle card flip state
  }

  viewMessages = (resident: number) => {
    this.router.navigate(['/residents', resident,'messages']); // Navigate to the messages page with the resident ID


  }

  viewResidentProfile = (resident: number) => {
    this.router.navigate(['/residents/detail', resident]); // Navigate to the messages page with the resident ID


  }

}
