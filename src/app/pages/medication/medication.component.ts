import {Component, computed, OnDestroy, OnInit, signal} from '@angular/core';
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
import {MedicationDetailModalComponent} from '../../components/medication-detail-modal/medication-detail-modal.component';
import {NgClass} from '@angular/common';
import { BackButtonComponent } from '../../components/table/back-button/back-button.component';



@Component({
  selector: 'app-medication',
  standalone: true,
  imports: [
    SearchBoxComponent,
    PaginatorComponent,
    TableComponent,
    AsyncPipe,
    SelectLimitComponent,
    RouterLink,
    MedicationDetailModalComponent,
    NgClass,
    BackButtonComponent,

  ],
  templateUrl: './medication.component.html',
  styleUrl: './medication.component.css',
})
export class MedicationComponent implements OnInit, OnDestroy {
  tableConfig: TableConfig<Medication> = {
    columns: [
      {
        colKey: 'name',
        label: 'Nome',
        type: ColumnType.PROFILE,
        classList: ['w-40'],
      },
      // {
      //   colKey: "instructions",
      //   label: "Instruções",
      //   classList: ["w-32"]
      // },
      // {
      //   colKey: "resident",
      //   label: "Residente",
      //   classList: ["w-32"]
      // },
      {
        colKey: 'quantity',
        label: 'Quantidade',
        classList: ['w-32'],
      },
      {
        colKey: 'prescriptionQuantity',
        label: 'Prescrições',
        classList: ['w-20'],
      },
      {
        colKey: 'dueDate',
        label: 'Validade',
        type: ColumnType.DATE,
        dateFormat: 'yyyy/MM/dd',
        classList: ['w-32'],
      },
    ],
  };
  private medicationListSignal = signal<Medication[]>([]);
  medicationList = computed(() => this.medicationListSignal());

  private subscription?: Subscription;

  constructor(
    private medicationService: MedicationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

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

  get residentId(): number {
    return parseInt(this.route.snapshot.params['residentId']) || 0;
  }

  ngOnInit() {
    console.log('pagina medicacao');
    let i = 0;
    this.medicationService.query$
      .pipe(
        tap((q) => console.log('Query: ', q)),
        switchMap(() =>
          this.medicationService.fetchList(
            parseInt(this.route.snapshot.paramMap.get('residentId') || '') || 0,
          ),
        ),
        tap(console.log),
        map((medication) => this.medicationListSignal.set(medication)),
      )
      .subscribe();
    this.route.snapshot.paramMap.get('residentId');
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

  // handleRowClicked(key: number) {
  //   this.router.navigate(["/medicaments/detail", key])
  // }

  handleRowClicked(medicationId: number) {
    this.router.navigate([
      `/residents/${this.residentId}/medicaments/${medicationId}`,
    ]);
  }

  handleLimitChange(limit: number) {
    this.medicationService.setPageSize(limit);
  }

  protected readonly Order = Order;
  selectedMedication: any;

  showModal(selectedMedication: any) {
    return false;
  }
}
