import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PaginatorComponent } from '../../components/table/paginator/paginator.component';
import { Router, RouterLink } from '@angular/router';
import { SearchBoxComponent } from '../../components/forms/search-box/search-box.component';
import { SelectLimitComponent } from '../../components/table/select-limit/select-limit.component';
import { TableComponent } from '../../components/table/table/table.component';
import { ColumnType, TableConfig } from '../../interfaces/table.interface';
import { Appointment } from '../../interfaces/appointment';
import { map, Observable, Subscription, switchMap, tap } from 'rxjs';
import {Order} from '../../interfaces/paged-response.interface';
import { ResidentAppointmentsService } from '../../services/residentsAppointments/resident-appointments.service';


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
  colKey: "startDate",
  label: "Data",
  type: ColumnType.DATE,
  dateFormat: 'dd/MM/yyyy',
  classList: ["w-32"]
},
{
  colKey: "appointmentType",
    label: "Modalidade",
  classList: ["w-32"]
},
{
  colKey: "appointmentStatus",
    label: "Estado",
  classList: ["w-20"]
},
]
}
private residentAppointmentsListSignal = signal<Appointment[]>([]);
residentAppointmentsList = computed(() => this.residentAppointmentsListSignal());

private subscription?: Subscription;

constructor(private residentAppointmentsService: ResidentAppointmentsService, private router: Router,) {
}
ngOnDestroy() {
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

ngOnInit() {
  let i = 0;
  this.residentAppointmentsService.query$
    .pipe(
      tap((q) => console.log("Query: ", q)),
      switchMap(() => this.residentAppointmentsService.fetchList()),
      map((appointments) => this.residentAppointmentsListSignal.set(appointments))
    )
    .subscribe();
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
  this.router.navigate(["/residents/:residentId/appointments", key]);
}

handleLimitChange(limit: number) {
  this.residentAppointmentsService.setPageSize(limit);
}

protected readonly Order = Order;
}