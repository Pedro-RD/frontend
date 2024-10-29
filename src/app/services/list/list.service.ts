import {BehaviorSubject, combineLatest, debounceTime, map} from 'rxjs';
import {Order} from '../../interfaces/paged-response.interface';

export abstract class ListService<T> {
  protected pageSubject = new BehaviorSubject(1);
  public page$ = this.pageSubject.asObservable();
  protected orderBySubject = new BehaviorSubject("id");
  protected orderSubject = new BehaviorSubject(Order.ASC);
  protected limitSubject = new BehaviorSubject(10);
  protected searchSubject = new BehaviorSubject("");
  public query$ = combineLatest(
    [
      this.pageSubject.asObservable(),
      this.orderBySubject.asObservable(),
      this.orderSubject.asObservable(),
      this.limitSubject.asObservable(),
      this.searchSubject.asObservable(),
    ]
  ).pipe(
    debounceTime(500),
    map(([page, orderBy, order, limit, search]) => ({
      page,
      order,
      orderBy,
      limit,
      search,
    })),
  )
  private totalPagesSubject = new BehaviorSubject<number>(0);
  public totalPages$ = this.totalPagesSubject.asObservable();

  protected get queryString() {
    return `?page=${this.pageSubject.value}&orderBy=${this.orderBySubject.value}&order=${this.orderSubject.value}&limit=${this.limitSubject.value}&search=${this.searchSubject.value}`;
  }

  setOrderBy(orderBy: string) {
    this.orderBySubject.next(orderBy);
  }

  setSearch(search: string) {
    this.searchSubject.next(search);
    this.setPage(1);
  }

  nextPage() {
    const oldValue = this.pageSubject.getValue();
    if (this.totalPagesSubject.value === 0)
      return;

    if (this.totalPagesSubject.value === this.pageSubject.value)
      return;

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
    if (size > 0)
      this.pageSubject.next(size);
  }

  clearAll() {
    this.pageSubject.next(1);
    this.orderSubject.next(Order.ASC);
    this.orderBySubject.next("id");
    this.limitSubject.next(10);
    this.searchSubject.next("");
  }

  protected setPage(page: number) {
    this.pageSubject.next(page);
  }
}
