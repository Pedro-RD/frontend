import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Administration } from '../../interfaces/administration';

@Injectable({
  providedIn: 'root',
})
export class MedicationAdministrationService {
  private readonly url: string = environment.apiUrl + 'medicament/';

  constructor(private httpClient: HttpClient) {}

  addAdministration(
    medicationId: number,
    administration: Administration,
  ): Observable<Administration> {
    console.log(
      'MedicationAdministrationService.addAdministration',
      administration,
    );
    return this.httpClient
      .post<Administration>(
        `${this.url}${medicationId}/administration`,
        administration,
      )
      .pipe(
        catchError((err) => {
          console.error('Failed to add administration', err);
          return of();
        }),
      );
  }

  deleteAdministration(
    medicationId: number,
    administrationId: number,
  ): Observable<void> {
    return this.httpClient
      .delete<void>(
        `${this.url}${medicationId}/administration/${administrationId}`,
      )
      .pipe(
        catchError((err) => {
          console.error('Failed to delete administration', err);
          return of();
        }),
      );
  }
}
