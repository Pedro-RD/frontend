import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of, tap} from 'rxjs';

import {environment} from '../../../environments/environment';
import { Resident, ResidentDTO } from '../../interfaces/resident';
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
    private toastService: ToastService,
  ) {
    super();
  }

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
        if (resident.birthDate) {
          resident.birthDate = new Date(resident.birthDate); // Parse the birthDate string into a Date object
        }
        console.log(typeof resident.birthDate); // Check the type
        if (!environment.production) console.log('Residente encontrado:', resident);
      }),
      catchError((err) => {
        if (!environment.production) console.error('Erro ao buscar residente:', err);
        this.toastService.error('Erro ao buscar residente');
        return of({} as Resident);
      })
    );
  }


  create(item: ResidentDTO): Observable<Resident> {
    if (!environment.production) console.log('Creating resident:', item);
    return this.httpClient.post<Resident>(this.url, item).pipe(
      map(resident => {
        if (!environment.production) console.log('Resident created:', resident);
        this.toastService.success('Resident created successfully');
        return resident;
      }),
      catchError((error) => {
        if (!environment.production) console.error('Error creating user:', error);
        throw error;
      })
    );
  }

  update(item: Resident): Observable<Resident> {
    if(!environment.production) console.log('A atualizar resdente:', item);
    return this.httpClient.patch<Resident>(`${this.url}/${item.id}`, item).pipe(
      map(resident => {
        if(!environment.production) console.log('Residente atualizado:', resident);
        this.toastService.success('Residente atualizado com sucesso');
        return resident;
    }),
      catchError((error)=> {
        if(!environment.production) console.error('Erro ao atualizar residente:', error);
        throw error;
      })
    );
  }
isDeleting = false;

  delete(id: number): Observable<void> {
   if (this.isDeleting) return of();
   this.isDeleting = true;
    return this.httpClient.delete<void>(`${this.url}/${id}`).pipe(
      map(() => {
        this.isDeleting = false;
        this.toastService.success('Residente eliminado com sucesso');
      }),
      catchError((error) => {
        if (!environment.production) console.error('Erro ao eliminar residente:', error);
        this.isDeleting = false;
        throw error;
      })
    );
  }
}
