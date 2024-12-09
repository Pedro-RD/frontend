import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PaginatorComponent } from '../../components/table/paginator/paginator.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SearchBoxComponent } from '../../components/forms/search-box/search-box.component';
import { SelectLimitComponent } from '../../components/table/select-limit/select-limit.component';
import { TableComponent } from '../../components/table/table/table.component';
import { ColumnType, TableConfig } from '../../interfaces/table.interface';
import { map, Observable, Subscription, switchMap, tap } from 'rxjs';
import { Payment } from '../../interfaces/payment';
import { Order } from '../../interfaces/paged-response.interface';
import { ResidentPaymentsService } from '../../services/residentsPayments/residents-payments.service';
import { PaymentType } from '../../interfaces/payment-type.enum';
import { BackButtonComponent } from '../../components/table/back-button/back-button.component';
@Component({
  selector: 'app-residents-payments',
  standalone: true,
  imports: [
    AsyncPipe,
    PaginatorComponent,
    RouterLink,
    SearchBoxComponent,
    SelectLimitComponent,
    TableComponent,
    SearchBoxComponent,
    BackButtonComponent,
  ],
  templateUrl: './residents-payments.component.html',
  styleUrl: './residents-payments.component.css'
})
export class ResidentsPaymentsComponent implements OnInit, OnDestroy {
tableConfig: TableConfig<Payment> = {
  columns: [
    {
      colKey: "date",
      label: "Data de Pagamento",
      type: ColumnType.DATE,
      dateFormat: 'dd/MM/yyyy',
      classList: ["w-40"]
    },
    {
      colKey: "month",
      label: "Mês / Ano",
      type: ColumnType.TEXT,
      classList: ["w-32"]
    },
    {
      colKey: "type",
      label: "Tipo de Pagamento",
      classList: ["w-32"]
    },
    {
      colKey: "amount",
      label: "Valor Total",
      classList: ["w-20"]
    },
  ]
}
private residentPaymentsListSignal = signal<Payment[]>([]);
residentPaymentsList = computed(() => this.residentPaymentsListSignal());


  private subscription?: Subscription;

  constructor(private residentPaymentsService: ResidentPaymentsService, private router: Router, public route: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    this.residentPaymentsService.clearAll();
    this.subscription?.unsubscribe();
  }
  get page (): Observable<number> {
    return this.residentPaymentsService.page$;
  }

  get totalPages(): Observable<number> {
    return this.residentPaymentsService.totalPages$;
  }

  get orderBy(): Observable<string> {
    return this.residentPaymentsService.orderBy$;
  }

  get orderDirection(): Observable<Order> {
    return this.residentPaymentsService.order$;
  }

  get limit (): Observable<number> {
    return this.residentPaymentsService.limit$;
  }

  private residentId? : number

  ngOnInit() {
    let i = 0;
    this.residentPaymentsService.query$
      .pipe(
        tap((q) => console.log("Query: ", q)),
        switchMap(() => this.residentPaymentsService.fetchList(parseInt(this.route.snapshot.paramMap.get("residentId") || "")||0)),
        tap(console.log),
        map((payments) => this.residentPaymentsListSignal.set(payments))
      )
      .subscribe();

    this.route.snapshot.paramMap.get("residentId");
  }

  handleSearch(searchTerm: string): void {
    this.residentPaymentsService.setSearch(searchTerm);
  }

  handleNextPage() {
    this.residentPaymentsService.nextPage();
  }

  handlePreviousPage() {
    this.residentPaymentsService.prevPage();
  }

  handleHeaderClick(key:string) {
    this.residentPaymentsService.setOrderBy(key);
  }

  handleRowCliked(key: number) {
    const residentId = this.route.snapshot.paramMap.get("residentId"); // Obtém o residentId da rota
    if (residentId) {
      this.router.navigate([`residents/${residentId}/payments/${key}`]);
    } else {
      console.error("Resident ID não encontrado na rota.");
    }
  }


  handleLimitChange(limit: number) {
    this.residentPaymentsService.setPageSize(limit);
  }

  protected readonly Order = Order;
}

