import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast/toast.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import PagedResponse from '../../interfaces/paged-response.interface';
import { ListService } from '../list/list.service';
import { Payment, PaymentDTO } from '../../interfaces/payment';

@Injectable({
  providedIn: 'root'
})
export class ResidentPaymentsService extends ListService<Payment> {
  readonly url: string = environment.apiUrl + 'residents/';


  constructor(
    private httpClient: HttpClient,
    private toastService: ToastService,
  ) {
    super();
  }


  fetchList(residentId: number): Observable<Payment[]> {
    return this.httpClient.get<PagedResponse<Payment>>(this.url + residentId + '/payments' + this.queryString).pipe(
      map((rxp) => {
        rxp.data.forEach(payment => {
          if (payment.date) {
            payment.date = new Date(payment.date)
            payment.date = `${payment.date.getDate()}/${payment.date.getMonth() + 1}/${payment.date.getFullYear()}`;
          }
          console.log(typeof payment.date);
          if (!environment.production) console.log('Pagamento encontrado:', payment);
        });
        console.log(rxp);
        this.setTotalPages(rxp.totalPages);
        return rxp;
      }),
      map(rxp => rxp.data.map((payment) => {
        if (payment.type === 'Outros') {
          payment.year = "---";
          payment.month = "---";
        } else {
          payment.month = payment.month + " / " + payment.year;
        }
        return payment;
      })),
      tap(console.log),
      catchError((err) => {
        console.log(err);
        return of([] as Payment[]);
      })
    );
  }

  fetchItem(id: number, residentId:number): Observable<Payment> {
    return this.httpClient.get<Payment>(`${this.url}${residentId}/payments/${id}`).pipe(
      tap((payment) => {
        if (payment.date) {
          payment.date = new Date(payment.date);
        }
        console.log(typeof payment.date);
        if(!environment.production) console.log('Pagamento encontrado:', payment);
      }),
      catchError((err) => {
        if (!environment.production) console.error('Erro ao encontrar pagamento:', err);
        this.toastService.error('Erro ao buscar pagamento');
        return of({} as Payment);
      })
    );
  }

  create(item: PaymentDTO, residentId:number): Observable<Payment> {
    if (!environment.production) console.log('A criar pagamento:', item);
    return this.httpClient.post<Payment>(this.url+residentId +'/payments', item).pipe(
      map(payment =>  {
        if (!environment.production) console.log('Pagamento criado:', payment);
        this.toastService.success('Pagamento criado com sucesso');
        return payment;
      }),
      catchError((error) => {
        if (!environment.production) console.error('Erro ao criar pagamento:', error);
        throw error;
      })
    );
  }

  update(id: number, item: PaymentDTO, residentId: number): Observable<Payment> {
    return this.httpClient.patch<Payment>(`${this.url}${residentId}/payments/${id}`, item).pipe(
      tap((updatedPayment) => {
        if (!environment.production) console.log('Pagamento atualizado:', updatedPayment);
        this.toastService.success('Pagamento atualizado com sucesso');
      }),
      catchError((error) => {
        if (!environment.production) console.error('Erro ao atualizar pagamento:', error);
        this.toastService.error('Erro ao atualizar pagamento');
        return of({} as Payment);
      })
    );
  }

  isDeleting = false;

  delete(id: number, residentId: number): Observable<void> {
    if (this.isDeleting) return of(); // Evita múltiplas requisições simultâneas
    this.isDeleting = true;

    return this.httpClient.delete<void>(`${this.url}${residentId}/payments/${id}`).pipe(
      map(() => {
        this.isDeleting = false;
        this.toastService.success('Pagamento eliminado com sucesso');
      }),
      catchError((error) => {
        if (!environment.production) {
          console.error('Erro ao eliminar pagamento:', error);
        }
        this.isDeleting = false;
        throw error; // Propaga o erro para ser tratado no componente
      })
    );
  }

}
