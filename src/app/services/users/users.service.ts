import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, map, Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ICrudService } from '../../interfaces/crud-service.interface';
import PagedResponse, { Order } from '../../interfaces/paged-response.interface';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService implements ICrudService<User> {

  private readonly url: string = environment.apiUrl + 'users';

  private page = 1;
  private limit = 10;
  private order: 'ASC' | 'DESC' = 'ASC';
  private totalCount = 0;
  private totalPages = 0;


  private readonly userList = new BehaviorSubject<PagedResponse<User> | null>(null);

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {
  }

  get userList$(): Observable<User[]> {
    return this.userList.asObservable().pipe(
      filter((rxp) => rxp !== null),
      map((rxp) => rxp.data || [])
    );
  }

  get totalUsers$(): Observable<number> {
    return this.userList.asObservable().pipe(
      filter((rxp) => rxp !== null),
      map((rxp) => rxp.totalCount || 0)
    );
  }

  get totalPages$(): Observable<number> {
    return this.userList.asObservable().pipe(
      filter((rxp) => rxp !== null),
      map((rxp) => rxp.totalPages || 0)
    );
  }

  get currentPage$(): Observable<number> {
    return this.userList.asObservable().pipe(
      filter((rxp) => rxp !== null),
      map((rxp) => rxp.page || 0)
    );
  }

  get limit$(): Observable<number> {
    return this.userList.asObservable().pipe(
      filter((rxp) => rxp !== null),
      map((rxp) => rxp.limit || 0)
    );
  }

  getAll(page: number, order: Order, limit: number): Observable<User[]> {
    this.page = page;
    this.order = order;
    this.limit = limit;
    return this.updateList();
  }

  getById(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.url}/${id}`).pipe(
      catchError((err) => {
        if (err?.status === 404) {
          this.router.navigate(['404']);
        }
        throw err;
      })
    );
  }

  create(obj: User): Observable<User> {
    return this.httpClient.post<User>(this.url, obj).pipe(
      tap(() => this.updateList().subscribe({
        error: (err) => console.error(err)
      }))
    );
  }

  update(id: number, obj: User): Observable<User> {
    return this.httpClient
      .put<User>(`${this.url}/${id}`, obj)
      .pipe(
        tap(() => this.updateList().subscribe({
          error: (err) => console.error(err)
        })))
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`)
      .pipe(
        tap(() => {
          if (this.page == this.totalPages && this.totalCount % this.limit == 1) {
            this.page--;
          }
          this.updateList().subscribe({
            error: (err) => console.error(err)
          });
        })
      );
  }

  resetList(): void {
    this.page = 1;
    this.order = 'ASC';
    this.limit = 10;

    this.userList.next(null);
  }

  private updateList() {
    return this.httpClient
      .get<PagedResponse<User>>(`${this.url}?page=${this.page}&order=${this.order}&limit=${this.limit}`)
      .pipe(
        tap((rxp) => {
          this.totalCount = rxp.totalCount;
          this.totalPages = rxp.totalPages;
        }),
        map((rxp) => {
          this.userList.next(rxp);
          return rxp.data;
        }),
      );
  }
}
