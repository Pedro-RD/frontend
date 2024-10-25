import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError, map, mergeMap, Observable, of, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import PagedResponse from '../../interfaces/paged-response.interface';
import {User} from '../../interfaces/user';
import {ListService} from '../list/list.service';
import {ToastService} from '../toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends ListService<User> {
  readonly url: string = environment.apiUrl + 'users';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private toastService: ToastService,
  ) {
    super();
  }

  fetchList(): Observable<User[]> {
    return this.httpClient
      .get<PagedResponse<User>>(this.url + this.makeRequestParams())
      .pipe(
        tap(({totalPages, data}) => {
          this.setPageCount(totalPages);
          this.setList(data);
          if (!environment.production) console.log(data);
        }),
        map(({data}) => data),
        catchError((err) => {
          if (!environment.production) console.error(err);
          this.toastService.error('Erro ao listar utilizadores');
          return of([]);
        }),
      );
  }

  fetchItem(id: number): Observable<User> {
    throw new Error('Method not implemented.');
  }

  create(item: User): Observable<User> {
    throw new Error('Method not implemented.');
  }

  update(item: User): Observable<User> {
    throw new Error('Method not implemented.');
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`)
      .pipe(
        tap((rxp) => (!environment.production) && console.log(rxp)),
        tap(() => {
          this.toastService.info("Utilizador Eliminado")
        }),
        mergeMap(() => this.fetchList()),
        map(() => undefined),
        catchError((err) => {
            if (!environment.production) console.error(err);
            this.toastService.error('Erro ao eliminar utilizador');
            return of();
          }
        )
      )
  }
}
