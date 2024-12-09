import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PaginatorComponent } from '../../components/table/paginator/paginator.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SearchBoxComponent } from '../../components/forms/search-box/search-box.component';
import { SelectLimitComponent } from '../../components/table/select-limit/select-limit.component';
import { TableComponent } from '../../components/table/table/table.component';
import { ColumnType, TableConfig } from '../../interfaces/table.interface';
import { Appointment } from '../../interfaces/appointment';
import { map, Observable, Subscription, switchMap, tap } from 'rxjs';
import {Order} from '../../interfaces/paged-response.interface';
import { ResidentAppointmentsService } from '../../services/residentsAppointments/resident-appointments.service';
import { BackButtonComponent } from '../../components/table/back-button/back-button.component';


@Component({
  selector: 'app-residents-appointments',
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
  templateUrl: './residents-appointments.component.html',
  styleUrl: './residents-appointments.component.css'
})
export class ResidentsAppointmentsComponent implements OnInit, OnDestroy{
tableConfig: TableConfig<Appointment> = {
  columns: [
    {
    colKey: "title",
    label: "Descrição",
    type: ColumnType.TEXT,
    classList: ["w-40"]
  },
{
  colKey: "start",
  label: "Data/Hora da Consulta",
  type: ColumnType.DATE,
  dateFormat: 'dd/MM/yyyy HH:mm',
  classList: ["w-32"]
},
{
  colKey: "type",
    label: "Modalidade",
  classList: ["w-32"]
},
{
  colKey: "status",
    label: "Estado",
  classList: ["w-20"]
},
]
}
private residentAppointmentsListSignal = signal<Appointment[]>([]);
residentAppointmentsList = computed(() => this.residentAppointmentsListSignal());

private subscription?: Subscription;

constructor(private residentAppointmentsService: ResidentAppointmentsService, private router: Router, public route: ActivatedRoute) {
}

ngOnDestroy(): void {
  this.residentAppointmentsService.clearAll();
  this.subscription?.unsubscribe();
}
get page (): Observable<number> {
  return this.residentAppointmentsService.page$;
}

get totalPages(): Observable<number> {
  return this.residentAppointmentsService.totalPages$;
}

get orderBy(): Observable<string> {
  return this.residentAppointmentsService.orderBy$;
}

get orderDirection(): Observable<Order> {
  return this.residentAppointmentsService.order$;
}

get limit (): Observable<number> {
  return this.residentAppointmentsService.limit$;
}

private residentId? : number

ngOnInit() {
  let i = 0;
  this.residentAppointmentsService.query$
    .pipe(
      tap((q) => console.log("Query: ", q)),
      switchMap(() => this.residentAppointmentsService.fetchList(parseInt(this.route.snapshot.paramMap.get("residentId") || "")||0)),
      tap(console.log),
      map((appointments) => this.residentAppointmentsListSignal.set(appointments))
    )
    .subscribe();

  this.route.snapshot.paramMap.get("residentId");
}

handleSearch(searchTerm: string): void {
  this.residentAppointmentsService.setSearch(searchTerm);
}

handleNextPage() {
  this.residentAppointmentsService.nextPage();
}

handlePreviousPage() {
  this.residentAppointmentsService.prevPage();
}

handleHeaderClick(key:string) {
  this.residentAppointmentsService.setOrderBy(key);
}

handleRowCliked(key: number) {
  const residentId = this.route.snapshot.paramMap.get("residentId"); // Obtém o residentId da rota
  if (residentId) {
    this.router.navigate([`residents/${residentId}/appointments/${key}`]);
  } else {
    console.error("Resident ID não encontrado na rota.");
  }
}


handleLimitChange(limit: number) {
  this.residentAppointmentsService.setPageSize(limit);
}

protected readonly Order = Order;
}
