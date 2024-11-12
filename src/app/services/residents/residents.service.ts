import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError, map, Observable, of, tap} from 'rxjs';

import {environment} from '../../../environments/environment';
import {Resident} from '../../interfaces/resident';
import {ListService} from '../list/list.service';
import {ToastService} from '../toast/toast.service';
import PagedResponse from '../../interfaces/paged-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ResidentsService extends ListService<Resident> {
  readonly url: string = environment.apiUrl + 'residents';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private toastService: ToastService,
  ) {
    super();
  }

  // fetchList(): Observable<Resident[]> {
  //   return this.httpClient
  //     .get<PagedResponse<Resident>>(this.url + this.makeRequestParams())
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

  fetchList(): Observable<Resident[]> {
    return this.httpClient.get<PagedResponse<Resident>>(this.url + this.queryString).pipe(
      tap((rxp) => {
        this.setTotalPages(rxp.totalPages);
      }),
      map(rxp => rxp.data),
      catchError((err) => {
        console.log(err);
        return of([] as Resident[]);
      })
    )
  }

  fetchItem(id: number): Observable<Resident> {
    return this.httpClient.get<Resident>(`${this.url}/${id}`).pipe(
      tap((resident) => {
        if (!environment.production) console.log('Residente encontrado:', resident);
      }),
      catchError((err) => {
        if (!environment.production) console.error('Erro ao buscar residente:', err);
        this.toastService.error('Erro ao buscar residente');
        return of({} as Resident);
      })
    );
  }

  create(item: Resident): Observable<Resident> {
    throw new Error('Method not implemented.');
  }

  update(item: Resident): Observable<Resident> {
    throw new Error('Method not implemented.');
  }

  delete(id: number): Observable<void> {
    // return this.httpClient.delete<void>(`${this.url}/${id}`)
    //   .pipe(
    //     tap((rxp) => (!environment.production) && console.log(rxp)),
    //     tap(() => {
    //       this.toastService.info("Residente Eliminado")
    //     }),
    //     // mergeMap(() => this.fetchList()),
    //     map(() => undefined),
    //     catchError((err) => {
    //         if (!environment.production) console.error(err);
    //         this.toastService.error('Erro ao eliminar residente');
    //         return of();
    //       }
    //     )
    //   )
    throw new Error('Method not implemented.');
  }
}
