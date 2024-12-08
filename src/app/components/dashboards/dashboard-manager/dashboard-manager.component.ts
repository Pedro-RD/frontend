import { Component, OnInit, HostListener } from '@angular/core';
import { ManagerDashboardService } from '../../../services/managerDashboard/manager-dashboard.service';
import { CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-dashboard-manager',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    NgIf,
    NgForOf,
    NgxChartsModule,
  ],
  templateUrl: './dashboard-manager.component.html',
  styleUrls: ['./dashboard-manager.component.css'],
})
export class DashboardManagerComponent implements OnInit {
  dashboardData: any;
  isLoading = true;
  legendPosition: LegendPosition = LegendPosition.Below;

  cardWidth: number = 400; // Default width for large screens
  cardHeight: number = 200; // Default height for large screens

  pieChartData: any[] = [];
  groupedBarChartData: any[] = [];

  customColors = [
    { name: 'Residentes', value: '#9bb6ff' },
    { name: 'Funcionários', value: '#92ffb3' },
    { name: 'Utilizadores', value: '#fc8e8e' },
  ];

  customColorsBars = [
    { name: 'Salários', value: '#9bb6ff' },
    { name: 'Pagamentos', value: '#fc8e8e' },
  ];

  constructor(private managerDashboardService: ManagerDashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
    this.updateChartSize(); // Initialize chart size
  }

  // Load the dashboard data
  private loadDashboardData() {
    this.managerDashboardService.getManagerDashboard().pipe(
      tap((data) => {
        this.dashboardData = data;
        this.prepareChartData();
        this.prepareGroupedBarChartData();
        this.isLoading = false;
      }),
      catchError((error) => {
        console.error(error);
        this.isLoading = false;
        return of(null); // Return an observable with a null value
      })
    ).subscribe();
  }

  // Prepare data for the pie chart
  private prepareChartData() {
    this.pieChartData = [
      {
        name: 'Residentes',
        value: this.dashboardData.residents,
      },
      {
        name: 'Funcionários',
        value: this.dashboardData.employees,
      },
      {
        name: 'Utilizadores',
        value: this.dashboardData.users,
      },
    ];
  }

  // Prepare data for the grouped bar chart
  private prepareGroupedBarChartData() {
    this.groupedBarChartData = this.dashboardData.payments.map((payment: any, index: number) => {
      const monthName = new Date(payment.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      return {
        name: monthName,
        series: [
          { name: 'Pagamentos', value: parseFloat(payment.total) || 0 },
          { name: 'Salários', value: this.dashboardData.salaries[index]?.total || 0 },
        ],
      };
    });

    // Sort the data in ascending order (oldest to newest)
    this.groupedBarChartData.sort((a, b) => new Date(a.name) > new Date(b.name) ? 1 : -1);
  }

  // Update chart size based on screen size
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateChartSize();
  }


  private updateChartSize() {
    const screenWidth = window.innerWidth;

    if (screenWidth < 640) {
      // Mobile screens
      this.cardWidth = Math.min(300, screenWidth * 0.9); // Slightly larger width for mobile
      this.cardHeight = 240; // Slightly increased height for better visibility
    } else if (screenWidth < 1024) {
      // Tablets or small desktops
      this.cardWidth = 320; // Balanced size for mid-range screens
      this.cardHeight = 260;
    } else {
      // Larger screens
      this.cardWidth = 380; // Standard width for large screens
      this.cardHeight = 280; // Standard height for large screens
    }
  }
}
