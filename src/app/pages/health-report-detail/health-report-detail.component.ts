import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HealthReport } from '../../interfaces/health-report';
import { Observable, Subscription } from 'rxjs';
import { ModalConfirmComponent } from '../../components/forms/modal-confirm/modal-confirm.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HealthReportService } from '../../services/health-report/health-report.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { Resident } from '../../interfaces/resident';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-health-report-detail',
  standalone: true,
  imports: [RouterLink, ModalConfirmComponent, NgIf, AsyncPipe],
  templateUrl: './health-report-detail.component.html',
  styleUrls: [],
})
export class HealthReportDetailComponent implements OnInit, OnDestroy {
  healthReport?: HealthReport;
  resident?: Resident;
  error: string | null = null;
  private subs: Subscription[] = [];
  @ViewChild(ModalConfirmComponent) deleteModal!: ModalConfirmComponent;

  constructor(
    private healthReportService: HealthReportService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const residentId = Number(this.route.snapshot.paramMap.get('residentId'));
    if (id && residentId) {
      this.subs.push(
        this.healthReportService.fetchItem(id, residentId).subscribe({
          next: (report) => {
            this.healthReport = report;
            this.resident = { id: residentId } as Resident;
          },
          error: (err) => {
            console.error(err);
            this.error = 'Relatório não encontrado';
          },
        }),
      );
    }
  }

  get isRelative(): Observable<boolean> {
    return this.auth.isRelative();
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  onDelete() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const residentId = Number(this.route.snapshot.paramMap.get('residentId'));

    if (!id || !residentId) {
      console.error('Informações insuficientes para excluir o relatório.');
      this.error = 'Falha ao eliminar relatório';
      return;
    }

    this.subs.push(
      this.healthReportService.delete(id, residentId).subscribe({
        next: () => {
          this.router.navigate([`/residents/${residentId}/health-reports`]); // Redireciona após exclusão
        },
        error: (err) => {
          console.error(err);
          this.error = 'Falha ao eliminar relatório';
        },
      }),
    );
  }

  showDeleteModal() {
    this.deleteModal.show();
  }
}
