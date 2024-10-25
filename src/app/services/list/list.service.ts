import {signal} from '@angular/core';
import {Observable} from 'rxjs';
import {Order, QueryParams} from '../../interfaces/paged-response.interface';

export abstract class ListService<T> {
  public listSignal = signal<T[]>([]);
  public lastPageCountSignal = signal(1);

  public params = signal<QueryParams>({
    orderBy: 'id',
    orderAsc: true,

    limit: 10,
    page: 1,

    search: '',
  });

  abstract fetchList(): Observable<T[]>;

  abstract fetchItem(id: number): Observable<T>;

  abstract create(item: T): Observable<T>;

  abstract update(item: T): Observable<T>;

  abstract delete(id: number): Observable<void>;

  setList(list: T[]) {
    this.listSignal.set(list);
  }

  setPageSize(size: number) {
    this.params.set({
      ...this.params(),
      limit: size,
    });
  }

  setPage(page: number) {
    this.params.set({
      ...this.params(),
      page,
    });
  }

  setOrderBy(orderBy: string) {
    let params = this.params();
    console.log(orderBy, params);
    let orderAsc = orderBy === params.orderBy ? !params.orderAsc : true;

    this.params.set({
      ...params,
      orderBy,
      orderAsc,
    });
  }

  setSearch(search: string) {
    this.params.set({
      ...this.params(),
      search,
    });
  }

  setPageCount(count: number) {
    if (count < 1) {
      count = 1;
    }
    this.lastPageCountSignal.apply(count);
  }

  clearAll() {
    this.listSignal.set([]);
    this.lastPageCountSignal.apply(1);
    this.params.set({
      orderBy: 'id',
      orderAsc: true,

      limit: 10,
      page: 1,

      search: '',
    });
  }

  makeRequestParams() {
    const page = `page=${this.params().page}`;
    const limit = `limit=${this.params().limit}`;
    const orderBy = `orderBy=${this.params().orderBy}`;
    const orderAsc = `order=${
      this.params().orderAsc ? Order.ASC : Order.DESC
    }`;
    const search = `search=${this.params().search}`;

    return `?${page}&${limit}&${orderBy}&${orderAsc}&${search}`;
  }
}
