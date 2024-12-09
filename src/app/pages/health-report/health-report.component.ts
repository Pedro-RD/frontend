import {Component, computed, OnDestroy, OnInit, signal} from '@angular/core';
import {SearchBoxComponent} from "../../components/forms/search-box/search-box.component";
import {PaginatorComponent} from '../../components/table/paginator/paginator.component';
import {HealthReportService} from '../../services/health-report/health-report.service';
import {Observable, map, switchMap, tap, Subscription} from 'rxjs';
import {TableComponent} from '../../components/table/table/table.component';
import {TableConfig} from '../../interfaces/table.interface';
import {HealthReport} from '../../interfaces/health-report';
import { of } from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {Order} from '../../interfaces/paged-response.interface';
import {SelectLimitComponent} from '../../components/table/select-limit/select-limit.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BackButtonComponent } from '../../components/table/back-button/back-button.component';

@Component({
  selector: 'app-healthreport',
  standalone: true,
  imports: [
    SearchBoxComponent,
    PaginatorComponent,
    TableComponent,
    AsyncPipe,
    SelectLimitComponent,
    RouterLink,
    BackButtonComponent,
  ],
  templateUrl: './health-report.component.html',
})
export class HealthReportComponent implements OnInit, OnDestroy {
  tableConfig: TableConfig<HealthReport> = {
    columns: [
      {
        colKey: "arterialBloodPressure",
        label: "Pressão Arterial",
        classList: ["w-40"]
      },
      {
        colKey: "respiratoryRate",
        label: "Frequência Respiratória",
        classList: ["w-40"]
      },
      {
        colKey: "heartRate",
        label: "Frequência Cardíaca",
        classList: ["w-40"]
      },
      {
        colKey: "bloodGlucoseLevel",
        label: "Nível de Glicose",
        classList: ["w-32"]
      }
    ]
  };

  private healthreportListSignal = signal<HealthReport[]>([]); // Usando a nova API de signals do Angular
  healthreportList = computed(() => this.healthreportListSignal());

  private subscription?: Subscription;

  constructor(
    private healthreportService: HealthReportService,
    private router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.healthreportService.clearAll();
    this.subscription?.unsubscribe();
  }

  get page(): Observable<number> {
    return this.healthreportService.page$;
  }

  get totalPages(): Observable<number> {
    return this.healthreportService.totalPages$;
  }

  get orderBy(): Observable<string> {
    return this.healthreportService.orderBy$;
  }

  get orderDirection(): Observable<Order> {
    return this.healthreportService.order$;
  }

  get limit(): Observable<number> {
    return this.healthreportService.limit$;
  }

  private residentId?: number;

  ngOnInit() {
    this.healthreportService.query$
      .pipe(
        switchMap(() => {
          const residentId = parseInt(this.route.snapshot.paramMap.get("residentId") || "", 10);

          // Verificar se o residentId é válido
          if (!residentId) {
            console.error("Resident ID is missing or invalid");
            return of([]); // Retorna um array vazio em caso de erro
          }

          // Chama o serviço para buscar os relatórios de saúde apenas para o residente específico
          return this.healthreportService.fetchList(residentId);
        }),
        map((reports) => this.healthreportListSignal.set(reports)) // Atualiza a lista de relatórios
      )
      .subscribe();
  }

  handleSearch(searchTerm: string): void {
    this.healthreportService.setSearch(searchTerm);
  }

  handleNextPage() {
    this.healthreportService.nextPage();
  }

  handlePreviousPage() {
    this.healthreportService.prevPage();
  }

  handleHeaderClick(key: string) {
    this.healthreportService.setOrderBy(key);
  }

  handleRowCliked(key: number) {
    const residentId = this.route.snapshot.paramMap.get("residentId"); // Obtém o residentId da rota
    if (residentId) {
      this.router.navigate([`residents/${residentId}/health-reports/${key}`]);
    } else {
      console.error("Resident ID não encontrado na rota.");
    }
  }

  handleLimitChange(limit: number) {
    this.healthreportService.setPageSize(limit);
  }

  protected readonly Order = Order;
}
