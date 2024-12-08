import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  tap,
} from 'rxjs';
import { Order } from '../../interfaces/paged-response.interface';

export abstract class ListService<T> {
  protected pageSubject = new BehaviorSubject(1);
  public page$ = this.pageSubject
    .asObservable()
    .pipe(debounceTime(50), distinctUntilChanged());

  protected orderBySubject = new BehaviorSubject('id');
  public orderBy$ = this.orderBySubject
    .asObservable()
    .pipe(debounceTime(50), distinctUntilChanged());

  protected orderSubject = new BehaviorSubject(Order.ASC);
  public order$ = this.orderSubject
    .asObservable()
    .pipe(debounceTime(50), distinctUntilChanged());

  protected limitSubject = new BehaviorSubject(10);
  public limit$ = this.limitSubject
    .asObservable()
    .pipe(debounceTime(50), distinctUntilChanged(), tap(console.log));

  protected searchSubject = new BehaviorSubject('');
  protected search$ = this.searchSubject
    .asObservable()
    .pipe(debounceTime(100), distinctUntilChanged());

  public query$ = combineLatest([
    this.page$,
    this.orderBy$,
    this.order$,
    this.limit$,
    this.search$,
  ]).pipe(
    debounceTime(50),
    map(([page, orderBy, order, limit, search]) => ({
      page,
      order,
      orderBy,
      limit,
      search,
    })),
  );

  private totalPagesSubject = new BehaviorSubject<number>(0);
  public totalPages$ = this.totalPagesSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  protected get queryString() {
    return `?page=${this.pageSubject.value}&orderBy=${this.orderBySubject.value}&order=${this.orderSubject.value}&limit=${this.limitSubject.value}&search=${this.searchSubject.value}`;
  }

  setOrderBy(orderBy: string) {
    const oldValue = this.orderBySubject.value;
    if (orderBy === oldValue) {
      return this.toggleOrderDirection();
    }

    this.orderBySubject.next(orderBy);
    this.resetOrderDirection();
  }

  setSearch(search: string) {
    this.searchSubject.next(search);
    this.setPage(1);
  }

  nextPage() {
    const oldValue = this.pageSubject.getValue();
    if (this.totalPagesSubject.value === 0) return;

    if (this.totalPagesSubject.value === this.pageSubject.value) return;

    this.pageSubject.next(oldValue + 1);
  }

  prevPage() {
    const oldValue = this.pageSubject.getValue();
    if (oldValue > 1) {
      this.pageSubject.next(oldValue - 1);
    }
  }

  setTotalPages(nPages: number) {
    this.totalPagesSubject.next(nPages);
  }

  setPageSize(size: number) {
    if (size > 0) {
      this.limitSubject.next(size);
      this.pageSubject.next(1);
    }
  }

  clearAll() {
    this.pageSubject.next(1);
    this.orderSubject.next(Order.ASC);
    this.orderBySubject.next('id');
    this.limitSubject.next(10);
    this.searchSubject.next('');
  }

  protected setPage(page: number) {
    this.pageSubject.next(page);
  }

  private toggleOrderDirection() {
    if (this.orderSubject.value === Order.DESC) {
      this.orderSubject.next(Order.ASC);
    } else {
      this.orderSubject.next(Order.DESC);
    }
  }

  private resetOrderDirection() {
    this.orderSubject.next(Order.ASC);
  }
}
