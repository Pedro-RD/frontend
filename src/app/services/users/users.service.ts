import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, take, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { User, UserDTO } from '../../interfaces/user';
import { ListService } from '../list/list.service';
import { ToastService } from '../toast/toast.service';
import PagedResponse from '../../interfaces/paged-response.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends ListService<User> {
  readonly url: string = environment.apiUrl + 'users';

  constructor(
    private httpClient: HttpClient,
    private toastService: ToastService,
  ) {
    super();
  }

  fetchList(): Observable<User[]> {
    return this.httpClient.get<PagedResponse<User>>(this.url + this.queryString).pipe(
      tap((rxp) => {
        this.setTotalPages(rxp.totalPages);
      }),
      map(rxp => rxp.data),
      catchError((err) => {
        if (!environment.production) console.error(err);
        return of([] as User[]);
      }),
    );
  }

  fetchItem(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.url}/${id}`).pipe(
      tap((user) => {
        if (!environment.production) console.log('Fetched user:', user);
      }),
      catchError((error) => {
        if (!environment.production) console.error('Error fetching user:', error);
        throw error;
      })
    );
  }

  create(item: UserDTO): Observable<User> {
    if (!environment.production) console.log('Creating user:', item);
    return this.httpClient.post<User>(this.url, item).pipe(
      map(user => {
        if (!environment.production) console.log('User created:', user);
        this.toastService.success('User created successfully');
        return user;
      }),
      catchError((error) => {
        if (!environment.production) console.error('Error creating user:', error);
        throw error;
      })
    );
  }

  update(item: User): Observable<User> {
    if (!environment.production) console.log('Updating user:', item);
    return this.httpClient.put<User>(`${this.url}/${item.id}`, item).pipe(
      map(user => {
        if (!environment.production) console.log('User updated:', user);
        this.toastService.success('User updated successfully');
        return user;
      }),
      catchError((error) => {
        if (!environment.production) console.error('Error updating user:', error);
        throw error;
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`).pipe(
      map(() => {
        this.toastService.success('User deleted successfully');
      }),
      catchError((error) => {
        if (!environment.production) console.error('Error deleting user:', error);
        throw error;
      })
    );
  }
}
