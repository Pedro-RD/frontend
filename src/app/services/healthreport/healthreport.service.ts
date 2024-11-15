import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError, map, Observable, of, tap} from 'rxjs';

import {environment} from '../../../environments/environment';
import {HealthReport} from '../../interfaces/healthreport';
import {ListService} from '../list/list.service';
import {ToastService} from '../toast/toast.service';
import PagedResponse from '../../interfaces/paged-response.interface';

@Injectable({
  providedIn: 'root',
})
export class HealthReportService extends ListService<HealthReport> {
  readonly url: string = environment.apiUrl + 'healthreport';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private toastService: ToastService,
  ) {
    super();
  }

  // fetchList(): Observable<HealthReport[]> {
  //   return this.httpClient
  //     .get<PagedResponse<HealthReport>>(this.url + this.makeRequestParams())
  //     .pipe(
  //       tap(({totalPages, data}) => {
  //         this.setPageCount(totalPages);
  //         this.setList(data);
  //         if (!environment.production) console.log(data);
  //       }),
  //       map(({data}) => data),
  //       catchError((err) => {
  //         if (!environment.production) console.error(err);
  //         this.toastService.error('Erro ao listar HealthReport');
  //         return of([]);
  //       }),
  //     );
  // }

  fetchList(): Observable<HealthReport[]> {
    return this.httpClient.get<PagedResponse<HealthReport>>(this.url + this.queryString).pipe(
      tap((rxp) => {
        this.setTotalPages(rxp.totalPages);
      }),
      map(rxp => rxp.data),
      catchError((err) => {
        console.log(err);
        return of([] as HealthReport[]);
      })
    )
  }

  fetchItem(id: number): Observable<HealthReport> {
    return this.httpClient.get<HealthReport>(`${this.url}/${id}`).pipe(
      tap((healthreport => {
        if (!environment.production) console.log('HealthReport encontrado:', healthreport);
      }),
      catchError((err) => {
        if (!environment.production) console.error('Erro ao buscar HealthReport:', err);
        this.toastService.error('Erro ao buscar HealthReport');
        return of({} as HealthReport);
      }))
    );
  }

  create(item: HealthReport): Observable<HealthReport> {
    throw new Error('Method not implemented.');
  }

  update(item: HealthReport): Observable<HealthReport> {
    throw new Error('Method not implemented.');
  }

  delete(id: number): Observable<void> {
    // return this.httpClient.delete<void>(`${this.url}/${id}`)
    //   .pipe(
    //     tap((rxp) => (!environment.production) && console.log(rxp)),
    //     tap(() => {
    //       this.toastService.info("HealthReport Eliminado")
    //     }),
    //     // mergeMap(() => this.fetchList()),
    //     map(() => undefined),
    //     catchError((err) => {
    //         if (!environment.production) console.error(err);
    //         this.toastService.error('Erro ao eliminar HealthReport');
    //         return of();
    //       }
    //     )
    //   )
    throw new Error('Method not implemented.');
  }
}
