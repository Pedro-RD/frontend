import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast/toast.service';
import { Shift, ShiftDTO } from '../../interfaces/shift';
import { catchError, map, Observable, of, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EmployeesShiftsService {
  readonly url: string = environment.apiUrl + 'employees/';

  constructor(
    private httpClient: HttpClient,
    private toastService: ToastService,
  ) {}

  fetchList(employeeId: number, from: string, to: string): Observable<Shift[]> {
    const url = `${this.url}${employeeId}/shifts`;
    const params = { from, to }; // Adiciona os parâmetros necessários
    console.log('Chamando URL:', url, 'com parâmetros:', params);

    return this.httpClient
      .get<Shift[]>(url, { params }) // Envia os parâmetros como query parameters
      .pipe(
        tap((shifts) => {
          console.log('Turnos recebidos no serviço:', shifts);
        }),
        catchError((err) => {
          console.error('Erro ao buscar turnos:', err);
          return of([] as Shift[]);
        })
      );
  }

  createOrUpdate(item: ShiftDTO, employeeId: number): Observable<Shift> {
    const url = `${this.url}${employeeId}/shifts`;

    // Construindo o payload como um array de turnos
    const payload = {
      shifts: [
        {
          day: item.day.toISOString().split('T')[0], // Converte para 'YYYY-MM-DD'
          shift: item.shift, // O tipo de turno
        },
      ],
    };

    console.log('Payload enviado ao backend:', payload);

    return this.httpClient.post<Shift>(url, payload).pipe(
      tap((response) => {
        if (item.id) {
          console.log('Turno atualizado:', response);
          this.toastService.success('Turno atualizado com sucesso');
        } else {
          console.log('Turno criado:', response);
          this.toastService.success('Turno criado com sucesso');
        }
      }),
      catchError((error) => {
        if (item.id) {
          console.error('Erro ao atualizar turno:', error);
          this.toastService.error('Erro ao atualizar turno');
        } else {
          console.error('Erro ao criar turno:', error);
          this.toastService.error('Erro ao criar turno');
        }
        return of({} as Shift); // Retorna um objeto vazio como fallback
      })
    );
  }
  createOrUpdateBulk(shifts: any[], employeeId: number): Observable<any> {
    const url = `${this.url}${employeeId}/shifts`;
    return this.httpClient.post(url, { shifts }).pipe(
      tap((response) => {
        console.log('Turnos atualizados:', response);
        this.toastService.success('Turnos atualizados com sucesso');
      }),
      catchError((error) => {
        console.error('Erro ao atualizar turnos:', error);
        this.toastService.error('Erro ao atualizar turnos');
        return of({}); // Retorna um objeto vazio como fallback
      })
    );
  }

}
