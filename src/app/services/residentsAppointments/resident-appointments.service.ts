import { Injectable } from '@angular/core';
import { ListService } from '../list/list.service';
import { Appointment, AppointmentDTO } from '../../interfaces/appointment';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast/toast.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import PagedResponse from '../../interfaces/paged-response.interface';


@Injectable({
  providedIn: 'root'
})
export class ResidentAppointmentsService  extends ListService<Appointment> {
  readonly url: string = environment.apiUrl + 'resident/:residentId/appointments';

  constructor(
    private httpClient: HttpClient,
    private toastService: ToastService,
  ) {
    super();
  }


  fetchList(): Observable<Appointment[]> {
    return this.httpClient.get<PagedResponse<Appointment>>(this.url + this.queryString).pipe(
      tap((rxp) => {
        this.setTotalPages(rxp.totalPages);
      }),
      map(rxp => rxp.data),
      catchError((err) => {
        console.log(err);
        return of([] as Appointment[]);
      })
    )
  }

  fetchItem(id: number): Observable<Appointment> {
    return this.httpClient.get<Appointment>(`${this.url}/${id}`).pipe(
      tap((appointment) => {
        if (appointment.startDate) {
          appointment.startDate = new Date(appointment.startDate);
        }
        console.log(typeof appointment.startDate);
        if(!environment.production) console.log('Consulta encontrada:', appointment);
      }),
      catchError((err) => {
        if (!environment.production) console.error('Erro ao buscar consulta:', err);
        this.toastService.error('Erro ao buscar consulta');
        return of({} as Appointment);
      })
    );
  }

  create (item: AppointmentDTO): Observable<Appointment> {
    if (!environment.production) console.log('A criar consulta:', item);
    return this.httpClient.post<Appointment>(this.url, item).pipe(
      map(appointment =>  {
        if (!environment.production) console.log('Consulta criada:', appointment);
        this.toastService.success('Consulta criada com sucesso');
        return appointment;
    }),
    catchError((error) => {
      if (!environment.production) console.error('Erro ao criar consulta:', error);
      throw error;
    })
  );
}

update(item: Appointment): Observable<Appointment> {
  if (!environment.production) console.log('A atualizar consulta:', item);
  return this.httpClient.patch<Appointment>(`${this.url}/${item.id}`, item).pipe(
    map(appointment => {
      if(!environment.production) console.log('Consulta atualizada:', appointment);
      this.toastService.success('Consulta atualizada com sucesso');
      return appointment;
    }),
    catchError((error) => {
      if (!environment.production) console.error('Erro ao atualizar consulta:', error);
      throw error;
  })
  );
}

isDeleting = false;

  delete(id: number): Observable<void> {
  if(this.isDeleting) return of();
  this.isDeleting = true;
  return this.httpClient.delete<void>(`${this.url}/${id}`).pipe(
    map((appointment) => {
      this.isDeleting = false;
      this.toastService.success('Consulta eliminada com sucesso');
    }),
    catchError((error) => {
      if (!environment.production) console.error('Erro ao eliminar consulta:', error);
      this.isDeleting = false;
      throw error;
    })
  );
  }
}
