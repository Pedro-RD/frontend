import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormHealthReportComponent } from '../../components/form-health-report/form-health-report.component';
import { Subscription } from 'rxjs';
import { Resident } from '../../interfaces/resident';
import { HealthReport, HealthReportDTO } from '../../interfaces/health-report';
import { ActivatedRoute, Router } from '@angular/router';
import { HealthReportService } from '../../services/health-report/health-report.service';

@Component({
  selector: 'app-health-report-edit',
  standalone: true,
  imports: [FormHealthReportComponent],
  templateUrl: './health-report-edit.component.html',
})
export class HealthReportEditComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  resident: Resident | null = null;
  healthReport: HealthReport | null = null;
  error: string | null = null;
  isSubmitting = false;

  constructor(
    private healthReportService: HealthReportService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    const reportId = Number(this.route.snapshot.paramMap.get('reportId'));
    const residentId = Number(this.route.snapshot.paramMap.get('residentId'));

    if (reportId && residentId) {
      this.subs.push(
        this.healthReportService.fetchItem(reportId, residentId).subscribe({
          next: (healthReport) => {
            this.healthReport = healthReport;
            this.resident = { id: residentId } as Resident; // Garante que o residente seja definido
          },
          error: (err) => {
            console.error(err);
            this.error = 'Relatório de saúde não encontrado';
          },
        }),
      );
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  onFormSubmit(healthReportDTO: HealthReportDTO) {
    if (!this.healthReport?.id || !this.resident?.id || this.isSubmitting)
      return;

    this.isSubmitting = true;
    this.error = null;

    console.log(
      `\n\n\nDados: ${JSON.stringify(healthReportDTO)} Id: ${
        this.healthReport.id
      }\n\n\n`,
    );

    this.subs.push(
      this.healthReportService
        .update(this.healthReport.id, healthReportDTO, this.resident.id)
        .subscribe({
          next: () =>
            this.router.navigate([
              `/residents/${this.resident?.id}/health-reports`,
            ]),
          error: (err) => {
            this.isSubmitting = false;
            this.error =
              err.error?.message || 'Falha ao atualizar o relatório de saúde';
          },
        }),
    );
  }
}
