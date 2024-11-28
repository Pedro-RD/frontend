import { Component, OnDestroy } from '@angular/core';
import { concatMap, Subscription, Subject } from 'rxjs';
import { HealthReportDTO } from '../../interfaces/health-report';
import { HealthReportService } from '../../services/health-report/health-report.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormHealthReportComponent } from '../../components/form-health-report/form-health-report.component';

@Component({
  selector: 'app-health-report-create',
  templateUrl: './health-report-create.component.html',
  styleUrls: [],
  standalone: true,
  imports: [
    RouterModule,
    FormHealthReportComponent,
  ],
})
export class HealthReportCreateComponent implements OnDestroy {
  residentHealthReportCreateSub: Subscription | undefined;
  private submitQueue = new Subject<HealthReportDTO>();
  private submitSub: Subscription;
  private isSubmitting = false;

  constructor(
    private healthReportService: HealthReportService,
    private router: Router,
    public route: ActivatedRoute
  ) {
    this.submitSub = this.submitQueue.pipe(
      concatMap((report) =>
        this.healthReportService.create(
          report,
          parseInt(this.route.snapshot.paramMap.get("residentId") || "") || 0
        )
      )
    ).subscribe({
      next: () => this.router.navigate(['/residents', parseInt(this.route.snapshot.paramMap.get("residentId") || "") || 0, '/health-reports']),
      error: (err) => console.error(err),
    });
  }

  ngOnDestroy() {
    this.submitQueue.complete();
    this.submitSub.unsubscribe();
  }

  onFormSubmit(healthreport: HealthReportDTO) {
    if(this.isSubmitting) return;
    this.isSubmitting = true;
    this.residentHealthReportCreateSub = this.healthReportService.create(healthreport,parseInt(this.route.snapshot.paramMap.get("residentId") || "")||0).subscribe({
      next:() => {
        this.isSubmitting = false;
        this.router.navigate(['/residents/'+ this.route.snapshot.paramMap.get("residentId")+'/health-reports']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error(err);
      }
    })
  }
}
