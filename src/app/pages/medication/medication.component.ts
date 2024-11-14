import {Component, computed, OnDestroy, OnInit, signal} from '@angular/core';
import {MedicationTableComponent} from '../../components/old/medication-table/medication-table.component';
import {SearchBoxComponent} from "../../components/forms/search-box/search-box.component";
import {PaginatorComponent} from '../../components/table/paginator/paginator.component';
import {MedicationService} from '../../services/medication/medication.service';
import {Observable, map, switchMap, tap, Subscription} from 'rxjs';
import {TableComponent} from '../../components/table/table/table.component';
import {ColumnType, TableConfig} from '../../interfaces/table.interface';
import {Medication} from '../../interfaces/medication';
import {AsyncPipe} from '@angular/common';
import {Order} from '../../interfaces/paged-response.interface';
import {SelectLimitComponent} from '../../components/table/select-limit/select-limit.component';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';


@Component({
  selector: 'app-medication',
  standalone: true,
  imports: [
    MedicationTableComponent,
    SearchBoxComponent,
    PaginatorComponent,
    TableComponent,
    AsyncPipe,
    SelectLimitComponent,
    RouterLink,
  ],
  templateUrl: './medication.component.html',
  styleUrl: './medication.component.css'
})
export class MedicationComponent implements OnInit, OnDestroy{
  tableConfig: TableConfig<Medication> = {
    columns:[
      {
        colKey: "name",
        label: "Nome",
        type: ColumnType.PROFILE,
        classList: ["w-40"]
      },
      {
        colKey: "instructions",
        label: "Instruções",
        classList: ["w-32"]
      },
      {
        colKey: "resident",
        label: "Residente",
        classList: ["w-32"]
      },
      {
        colKey: "quantity",
        label: "Quantidade",
        classList: ["w-32"]
      },
      {
        colKey: "prescriptions",
        label: "Prescrições",
        classList: ["w-20"]
      },
      {
        colKey: "validity",
        label: "Validade",
        type: ColumnType.DATE,
        dateFormat: 'dd/MM/yyyy',
        classList: ["w-32"]
      },
    ]
  }
  private medicationListSignal = signal<Medication[]>([]);
  medicationList = computed(() => this.medicationListSignal());

  private subscription?: Subscription;

  constructor(private medicationService: MedicationService, private router: Router, private route: ActivatedRoute) {
  }


  ngOnDestroy(): void {
    this.medicationService.clearAll();
    this.subscription?.unsubscribe();
  }

  get page(): Observable<number> {
    return this.medicationService.page$;
  }

  get totalPages(): Observable<number> {
    return this.medicationService.totalPages$;
  }

  get orderBy(): Observable<string> {
    return this.medicationService.orderBy$;
  }

  get orderDirection(): Observable<Order> {
    return this.medicationService.order$;
  }

  get limit(): Observable<number> {
    return this.medicationService.limit$;
  }

  private residentId? : number

  ngOnInit() {
    let i = 0;
    this.medicationService.query$
      .pipe(
        tap((q) => console.log("Query: ", q)),
        switchMap(() => this.medicationService.fetchList  (parseInt(this.route.snapshot.paramMap.get("residentId")||"")||0)),
        map((medication) => this.medicationListSignal.set(medication))
      )
      .subscribe();
    this.route.snapshot.paramMap.get("residentId");
  }

  handleSearch(searchTerm: string): void {
    this.medicationService.setSearch(searchTerm);
  }

  handleNextPage() {
    this.medicationService.nextPage();
  }

  handlePreviousPage() {
    this.medicationService.prevPage();
  }

  handleHeaderClick(key: string) {
    this.medicationService.setOrderBy(key);
  }

  handleRowClicked(key: number) {
    this.router.navigate(["/medication/detail", key])
  }

  handleLimitChange(limit: number) {
    this.medicationService.setPageSize(limit);
  }

  protected readonly Order = Order;
}

