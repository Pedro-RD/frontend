import { Observable } from "rxjs";
import PagedResponse, { QueryParams } from "./paged-response.interface";

export interface ICrudService<T> {
    getAll(): Observable<ListData<T>>;
    getById(id: number): Observable<T>;
    create(obj: T): Observable<T>;
    update(id: number, obj: T): Observable<T>;
    delete(id: number): Observable<void>
}

export interface ListData<T> {
    query: QueryParams;
    response: PagedResponse<T>;
}