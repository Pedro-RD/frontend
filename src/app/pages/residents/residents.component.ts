import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { SearchBoxComponent } from '../../components/forms/search-box/search-box.component';
import { PaginatorComponent } from '../../components/table/paginator/paginator.component';
import { ResidentsService } from '../../services/residents/residents.service';
import { Observable, map, switchMap, tap, Subscription } from 'rxjs';
import { TableComponent } from '../../components/table/table/table.component';
import { ColumnType, TableConfig } from '../../interfaces/table.interface';
import { Resident } from '../../interfaces/resident';
import { AsyncPipe } from '@angular/common';
import { Order } from '../../interfaces/paged-response.interface';
import { SelectLimitComponent } from '../../components/table/select-limit/select-limit.component';
import { Router, RouterLink } from '@angular/router';
import { BackButtonComponent } from '../../components/table/back-button/back-button.component';
import {
  BackButtonDashboardComponent
} from '../../components/table/back-button-dashboard/back-button-dashboard.component';

@Component({
  selector: 'app-residents',
  standalone: true,
  imports: [
    SearchBoxComponent,
    PaginatorComponent,
    TableComponent,
    AsyncPipe,
    SelectLimitComponent,
    RouterLink,
    BackButtonComponent,
    BackButtonDashboardComponent,
  ],
  templateUrl: './residents.component.html',
  styleUrl: './residents.component.css',
})
export class ResidentsComponent implements OnInit, OnDestroy {
  tableConfig: TableConfig<Resident> = {
    columns: [
      {
        colKey: 'name',
        label: 'Nome',
        type: ColumnType.PROFILE,
        classList: ['w-40'],
        imageKey: 'profilePicture',
      },
      {
        colKey: 'birthDate',
        label: 'Data de Nascimento',
        type: ColumnType.DATE,
        dateFormat: 'dd/MM/yyyy',
        classList: ['w-32'],
      },
      {
        colKey: 'fiscalId',
        label: 'Nº Identificação Fiscal',
        classList: ['w-32'],
      },
      {
        colKey: 'bedNumber',
        label: 'Cama',
        classList: ['w-20'],
      },
    ],
  };
  private residentListSignal = signal<Resident[]>([]);
  residentList = computed(() => this.residentListSignal());

  private subscription?: Subscription;

  constructor(
    private residentsService: ResidentsService,
    private router: Router,
  ) {}

  ngOnDestroy(): void {
    this.residentsService.clearAll();
    this.subscription?.unsubscribe();
  }

  get page(): Observable<number> {
    return this.residentsService.page$;
  }

  get totalPages(): Observable<number> {
    return this.residentsService.totalPages$;
  }

  get orderBy(): Observable<string> {
    return this.residentsService.orderBy$;
  }

  get orderDirection(): Observable<Order> {
    return this.residentsService.order$;
  }

  get limit(): Observable<number> {
    return this.residentsService.limit$;
  }

  ngOnInit() {
    let i = 0;
    this.residentsService.query$
      .pipe(
        tap((q) => console.log('Query: ', q)),
        switchMap(() => this.residentsService.fetchList()),
        map((residents) => this.residentListSignal.set(residents)),
      )
      .subscribe();
  }

  handleSearch(searchTerm: string): void {
    this.residentsService.setSearch(searchTerm);
  }

  handleNextPage() {
    this.residentsService.nextPage();
  }

  handlePreviousPage() {
    this.residentsService.prevPage();
  }

  handleHeaderClick(key: string) {
    this.residentsService.setOrderBy(key);
  }

  handleRowCliked(key: number) {
    this.router.navigate(['/residents/detail', key]);
  }

  handleLimitChange(limit: number) {
    this.residentsService.setPageSize(limit);
  }

  protected readonly Order = Order;
}
