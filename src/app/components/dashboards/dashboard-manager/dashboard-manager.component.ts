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

  chartWidth: number = 400; // Default width for large screens
  chartHeight: number = 200; // Default height for large screens

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
      this.chartWidth = screenWidth * 0.78; // 90% of screen width
      this.chartHeight = 250; // Smaller height for mobile
    } else if (screenWidth < 1024) {
      this.chartWidth = screenWidth * 0.7; // 70% of screen width
      this.chartHeight = 350; // Medium height for tablets
    } else {
      this.chartWidth = 550; // Fixed width for large screens
      this.chartHeight = 350; // Fixed height for large screens
    }
  }
}
