import {Component, computed, OnDestroy, OnInit, signal} from '@angular/core';
import {SearchBoxComponent} from "../../components/forms/search-box/search-box.component";
import {PaginatorComponent} from '../../components/table/paginator/paginator.component';
import {HealthReportService} from '../../services/healthreport/healthreport.service';
import {Observable, map, switchMap, tap, Subscription} from 'rxjs';
import {TableComponent} from '../../components/table/table/table.component';
import {TableConfig} from '../../interfaces/table.interface';
import {HealthReport} from '../../interfaces/healthreport';
import {AsyncPipe} from '@angular/common';
import {Order} from '../../interfaces/paged-response.interface';
import {SelectLimitComponent} from '../../components/table/select-limit/select-limit.component';
import {Router, RouterLink} from '@angular/router';


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
  ],
  templateUrl: './healthreport.component.html',
  styleUrl: './healthreport.component.css'
})
export class HealthReportComponent implements OnInit, OnDestroy{
  tableConfig: TableConfig<HealthReport> = {
    columns: [
      {
        colKey: "arterialBloodPressure",
        label: "Pressão Arterial",
        classList: ["w-40"]
      },
      {
        colKey: "temperature",
        label: "Temperatura (°C)",
        classList: ["w-40"]
      },
      {
        colKey: "height",
        label: "Altura (cm)",
        classList: ["w-40"]
      },
      {
        colKey: "weight",
        label: "Peso (kg)",
        classList: ["w-40"]
      },
      {
        colKey: "respiratoryRate",
        label: "Frequência Respiratória (rpm)",
        classList: ["w-40"]
      },
      {
        colKey: "heartRate",
        label: "Frequência Cardíaca",
        classList: ["w-40"]
      },
      {
        colKey: "bloodGlucoseLevel",
        label: "Nível de Glicose no Sangue (mg/dL)",
        classList: ["w-40"]
      },
      {
        colKey: "mobility",
        label: "Mobilidade",
        classList: ["w-40"]
      },
      {
        colKey: "hydrationLevel",
        label: "Nível de Hidratação",
        classList: ["w-40"]
      },
      {
        colKey: "cognitiveEmotionalAssessment",
        label: "Avaliação Cognitiva e Emocional",
        classList: ["w-40"]
      },
      {
        colKey: "bloodOxygenLevel",
        label: "Nível de Oxigénio no Sangue (%)",
        classList: ["w-40"]
      },
      {
        colKey: "resident.name",
        label: "Nome do Residente",
        classList: ["w-40"]
      },
      {
        colKey: "resident.age",
        label: "Idade do Residente",
        classList: ["w-40"]
      }
    ]
    
  }
  private healthreportListSignal = signal<HealthReport[]>([]);
  healthreportList = computed(() => this.healthreportListSignal());

  private subscription?: Subscription;

  constructor(private healthreportService: HealthReportService, private router: Router) {
  }

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

  ngOnInit() {
    let i = 0;
    this.healthreportService.query$
      .pipe(
        tap((q) => console.log("Query: ", q)),
        switchMap(() => this.healthreportService.fetchList()),
        map((healthreport) => this.healthreportListSignal.set(healthreport))
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
    this.router.navigate(["/healthreport/detail", key])
  }

  handleLimitChange(limit: number) {
    this.healthreportService.setPageSize(limit);
  }

  protected readonly Order = Order;
}



