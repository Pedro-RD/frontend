import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Medication } from '../../interfaces/medication';
import { ListService } from '../list/list.service';
import { ToastService } from '../toast/toast.service';
import PagedResponse from '../../interfaces/paged-response.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MedicationService extends ListService<Medication> {
  readonly url: string = environment.apiUrl + 'residents/';

  constructor(
    private httpClient: HttpClient,
    private toastService: ToastService,
  ) {
    super();
  }

  // Read Medication:
  fetchList(residentId: number): Observable<Medication[]> {
    console.log(this.queryString);
    return this.httpClient
      .get<PagedResponse<Medication>>(
        this.url + residentId + '/medicaments' + this.queryString,
      )
      .pipe(
        tap((rxp) => {
          console.log(rxp);
          this.setTotalPages(rxp.totalPages);
        }),
        map((rxp) => rxp.data),
        catchError((err) => {
          console.log(err);
          return of([] as Medication[]);
        }),
      );
  }

  // Create Medication:
  create(residentId: number, item: Medication): Observable<Medication> {
    console.log('MedicationService.create', item);
    return this.httpClient
      .post<Medication>(this.url + residentId + '/medicaments', item)
      .pipe(
        tap((medicament) => {
          this.toastService.success('Medicação criada com sucesso');
        }),
        catchError((err) => {
          console.error(err);
          this.toastService.error('Erro ao criar medicação');
          return of({} as Medication);
        }),
      );
  }

  // Fetch a single Medication item:
  fetchItem(residentId: number, medicationId: number): Observable<Medication> {
    return this.httpClient
      .get<Medication>(`${this.url}${residentId}/medicaments/${medicationId}`)
      .pipe(
        tap(console.log),
        catchError((err) => {
          console.error(err);
          this.toastService.error('Erro ao buscar medicação');
          return of({} as Medication);
        }),
      );
  }

  // Update Medication:
  update(
    residentId: string,
    medicationId: string,
    item: Medication,
  ): Observable<Medication> {
    return this.httpClient
      .patch<Medication>(
        `${this.url}${residentId}/medicaments/${medicationId}`,
        item,
      )
      .pipe(
        tap(() => {
          this.toastService.success('Medicação atualizada com sucesso');
        }),
        catchError((err) => {
          console.error(err);
          this.toastService.error('Erro ao atualizar medicação');
          return of({} as Medication);
        }),
      );
  }

  // Delete Medication:
  delete(residentId: string, medicationId: string): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.url}${residentId}/medicaments/${medicationId}`)
      .pipe(
        tap(() => {
          this.toastService.success('Medicação eliminada com sucesso');
        }),
        catchError((err) => {
          console.error(err);
          this.toastService.error('Erro ao eliminar medicação');
          return of();
        }),
      );
  }

  // Get Medication by ID:
  getMedicationById(
    residentId: string,
    medicationId: string,
  ): Observable<Medication> {
    return this.httpClient
      .get<Medication>(`${this.url}${residentId}/medicaments/${medicationId}`)
      .pipe(
        tap(console.log),
        catchError((err) => {
          this.toastService.error('Erro ao buscar medicação');
          return of({} as Medication);
        }),
      );
  }
}
