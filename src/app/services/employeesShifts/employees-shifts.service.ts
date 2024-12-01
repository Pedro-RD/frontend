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

    // Se o item já tiver um id, é um update, caso contrário, é um create.
    const request$ = item.id ?
      this.httpClient.put<Shift>(`${url}/${item.id}`, item) :
      this.httpClient.post<Shift>(url, item);

    return request$.pipe(
      tap((shift) => {
        if (!environment.production) {
          if (item.id) {
            console.log('Turno atualizado:', shift);
          } else {
            console.log('Turno criado:', shift);
          }
        }
        // Exibe uma mensagem de sucesso dependendo se foi um create ou update
        const successMessage = item.id ? 'Turno atualizado com sucesso' : 'Turno criado com sucesso';
        this.toastService.success(successMessage);
      }),
      catchError((error) => {
        if (!environment.production) {
          console.error(item.id ? 'Erro ao atualizar turno:' : 'Erro ao criar turno:', error);
        }
        this.toastService.error(item.id ? 'Erro ao atualizar turno' : 'Erro ao criar turno');
        return of({} as Shift);  // Retorna um objeto vazio como fallback
      })
    );
  }


}
