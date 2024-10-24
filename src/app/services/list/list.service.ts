import {BehaviorSubject, distinctUntilChanged, Observable, take} from 'rxjs';
import {Order, QueryParams} from '../../interfaces/paged-response.interface';

export abstract class ListService {
  private querySubject$: BehaviorSubject<QueryParams>;
  public query$: Observable<QueryParams>;

  protected constructor() {
    this.querySubject$ = new BehaviorSubject<QueryParams>({
      page: 1,
      orderAsc: true,
      orderBy: 'id',
      limit: 10,
      search: '',
    });

    this.query$ = this.querySubject$.asObservable();
  }

  getQuerySting(queryParams: QueryParams): string {
    return `?page=${queryParams.page}&limit=${queryParams.limit}&orderBy=${queryParams.orderBy}&search=${queryParams.search}&order=${queryParams.orderAsc ? Order.ASC : Order.DESC}`;
  }

  setPage(page: number) {
    this.querySubject$.next({...this.querySubject$.value, page});
  }

  nextPage() {
    this.querySubject$.next({...this.querySubject$.value, page: this.querySubject$.value.page + 1});
  }

  previousPage() {
    this.querySubject$.next({...this.querySubject$.value, page: this.querySubject$.value.page - 1});
  }

  resetPage() {
    this.querySubject$.next({...this.querySubject$.value, page: 1});
  }

  toggleOrder() {
    this.querySubject$.next({
      ...this.querySubject$.value,
      orderAsc: !this.querySubject$.value.orderAsc,
      page: 1,
    });
  }

  resetOrder() {
    this.querySubject$.next({...this.querySubject$.value, orderAsc: true});
  }

  setOrderBy(orderBy: string) {
    this.querySubject$.next({
      ...this.querySubject$.value,
      orderAsc: true,
      orderBy,
      page: 1,
    });
  }

  setSearch(search: string) {
    this.querySubject$.next({...this.querySubject$.value, search, page: 1});
  }

  resetQuery() {
    this.querySubject$.next({
      page: 1,
      orderAsc: true,
      orderBy: 'id',
      limit: 10,
      search: '',
    });
  }
}
