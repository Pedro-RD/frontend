import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HealthReportService } from '../../services/healthreport/healthreport.service';
import { HealthReport } from '../../interfaces/healthreport';
import { Resident } from '../../interfaces/resident';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-healthreport-detail',
  templateUrl: './healthreport-detail.component.html',
  styleUrls: ['./healthreport-detail.component.css'],
  standalone: true,
  imports: [
    CommonModule,
  ],
})
export class HealthReportDetailComponent implements OnInit {
  healthreport: HealthReport = {
    id: 0,
    arterialBloodPressure: '',
    temperature: 0,
    height: 0,
    weight: 0,
    respiratoryRate: 0,
    heartRate: '',
    bloodGlucoseLevel: 0,
    mobility: '',
    hydrationLevel: '',
    cognitiveEmotionalAssessment: 0,
    bloodOxygenLevel: 0,
    resident: {} as Resident, // Certifique-se de que o 'resident' está sendo corretamente recebido
  };

  error: string | null = null;

  constructor(
    private healthreportService: HealthReportService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];

    this.healthreportService.fetchItem(id).subscribe({
      next: (healthreport) => {
        this.healthreport = healthreport; // Atualizando com os dados recebidos
      },
      error: () => {
        this.error = 'Failed to fetch health report'; // Exibindo erro se falhar
      },
    });
  }
}
