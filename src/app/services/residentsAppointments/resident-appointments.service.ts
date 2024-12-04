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
  readonly url: string = environment.apiUrl + 'residents/';


  constructor(
    private httpClient: HttpClient,
    private toastService: ToastService,
  ) {
    super();
  }


  fetchList(residentId: number): Observable<Appointment[]> {
    return this.httpClient.get<PagedResponse<Appointment>>(this.url +residentId +'/appointments' + this.queryString).pipe(
      tap((rxp) => {
        console.log(rxp)
        this.setTotalPages(rxp.totalPages);
      }),
       map(rxp => rxp.data),
      tap(console.log),
      catchError((err) => {
        console.log(err);
        return of([] as Appointment[]);
      })
    )
  }

  fetchItem(id: number, residentId:number): Observable<Appointment> {
    return this.httpClient.get<Appointment>(`${this.url}${residentId}/appointments/${id}`).pipe(
      tap((appointment) => {
        if (appointment.start) {
          appointment.start = new Date(appointment.start);
        }
        console.log(typeof appointment.start);
        if(!environment.production) console.log('Consulta encontrada:', appointment);
      }),
      catchError((err) => {
        if (!environment.production) console.error('Erro ao buscar consulta:', err);
        this.toastService.error('Erro ao buscar consulta');
        return of({} as Appointment);
      })
    );
  }

  create(item: AppointmentDTO, residentId:number): Observable<Appointment> {
    if (!environment.production) console.log('A criar consulta:', item);
    return this.httpClient.post<Appointment>(this.url+residentId +'/appointments', item).pipe(
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

  update(id: number, item: AppointmentDTO, residentId: number): Observable<Appointment> {
    return this.httpClient.patch<Appointment>(`${this.url}${residentId}/appointments/${id}`, item).pipe(
      tap((updatedAppointment) => {
        if (!environment.production) console.log('Consulta atualizada:', updatedAppointment);
        this.toastService.success('Consulta atualizada com sucesso');
      }),
      catchError((error) => {
        if (!environment.production) console.error('Erro ao atualizar consulta:', error);
        this.toastService.error('Erro ao atualizar consulta');
        return of({} as Appointment);
      })
    );
  }

isDeleting = false;

  delete(id: number, residentId: number): Observable<void> {
    if (this.isDeleting) return of(); // Evita múltiplas requisições simultâneas
    this.isDeleting = true;

    return this.httpClient.delete<void>(`${this.url}${residentId}/appointments/${id}`).pipe(
      map(() => {
        this.isDeleting = false;
        this.toastService.success('Consulta eliminada com sucesso');
      }),
      catchError((error) => {
        if (!environment.production) {
          console.error('Erro ao eliminar consulta:', error);
        }
        this.isDeleting = false;
        throw error; // Propaga o erro para ser tratado no componente
      })
    );
  }
}
