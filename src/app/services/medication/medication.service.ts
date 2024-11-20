import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError, map, Observable, of, tap} from 'rxjs';

import {environment} from '../../../environments/environment';
import {Medication} from '../../interfaces/medication';
import {ListService} from '../list/list.service';
import {ToastService} from '../toast/toast.service';
import PagedResponse from '../../interfaces/paged-response.interface';

@Injectable({
  providedIn: 'root',
})
export class MedicationService extends ListService<Medication> {
  readonly url: string = environment.apiUrl + 'residents/';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private toastService: ToastService,
  ) {
    super();
  }

  // fetchList(): Observable<Medication[]> {
  //   return this.httpClient
  //     .get<PagedResponse<Medication>>(this.url + this.makeRequestParams())
  //     .pipe(
  //       tap(({totalPages, data}) => {
  //         this.setPageCount(totalPages);
  //         this.setList(data);
  //         if (!environment.production) console.log(data);
  //       }),
  //       map(({data}) => data),
  //       catchError((err) => {
  //         if (!environment.production) console.error(err);
  //         this.toastService.error('Erro ao listar residentes');
  //         return of([]);
  //       }),
  //     );
  // }



// mandar resident ID » + "&residentId=$`residentId`"
  fetchList(residentId:number): Observable<Medication[]> {
    console.log(this.queryString);
    return this.httpClient.get<PagedResponse<Medication>>(this.url + residentId + "/medicaments" + this.queryString).pipe(
      tap((rxp) => {
        console.log(rxp);
        this.setTotalPages(rxp.totalPages);
      }),
      map(rxp => rxp.data),
      catchError((err) => {
        console.log(err);
        return of([] as Medication[]);
      })
    )
  }

  fetchItem(id: number): Observable<Medication> {
    throw new Error('Method not implemented.');
  }

  create(item: Medication): Observable<Medication> {
    throw new Error('Method not implemented.');
  }

  update(item: Medication): Observable<Medication> {
    throw new Error('Method not implemented.');
  }

  delete(id: number): Observable<void> {
    // return this.httpClient.delete<void>(`${this.url}/${id}`)
    //   .pipe(
    //     tap((rxp) => (!environment.production) && console.log(rxp)),
    //     tap(() => {
    //       this.toastService.info("Medicação Eliminada")
    //     }),
    //     // mergeMap(() => this.fetchList()),
    //     map(() => undefined),
    //     catchError((err) => {
    //         if (!environment.production) console.error(err);
    //         this.toastService.error('Erro ao eliminar medicação');
    //         return of();
    //       }
    //     )
    //   )
    throw new Error('Method not implemented.');
  }
}
