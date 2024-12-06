import { Component, OnInit } from '@angular/core';
import { ManagerDashboardService } from '../../../services/managerDashboard/manager-dashboard.service';
import { catchError, of, tap } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard-caretaker',
  standalone: true,
  imports: [
    NgIf,
  ],
  templateUrl: './dashboard-caretaker.component.html',
  styleUrl: './dashboard-caretaker.component.css'
})
export class DashboardCaretakerComponent implements OnInit{
  dashboardData: any;
  isLoading = true;

  constructor(private managerDashboardService: ManagerDashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  // Load the dashboard data
  private loadDashboardData() {
    this.managerDashboardService.getCaretakerDashboard().pipe(
      tap((data) => {
        this.dashboardData = data;
        this.isLoading = false;
      }),
      catchError((error) => {
        console.error(error);
        this.isLoading = false;
        return of(null); // Return an observable with a null value
      })
    ).subscribe();
  }












}
