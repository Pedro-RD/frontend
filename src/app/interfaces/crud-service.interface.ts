import { Observable } from "rxjs";

export interface ICrudService<T> {
    getAll(page: number, order: 'ASC' | 'DESC', limit: number): Observable<T[]>;
    getById(id: number): Observable<T>;
    create(obj: T): Observable<T>;
    update(id: number, obj: T): Observable<T>;
    delete(id: number): Observable<void>
}