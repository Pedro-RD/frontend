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
  private readonly url: string = environment.apiUrl + 'residents/';

  constructor(private httpClient: HttpClient) {}

  getAdministrations(residentId: number, medicationId: number): Observable<Administration[]> {
    return this.httpClient.get<Administration[]>(`${this.url}${residentId}/medicaments/${medicationId}/administration`).pipe(
      catchError((err) => {
        console.error('Failed to load administrations', err);
        return of([]);
      })
    );
  }

  addAdministration(residentId: number, medicationId: number, administration: Administration): Observable<Administration> {
    return this.httpClient.post<Administration>(`${this.url}${residentId}/medicaments/${medicationId}/administration`, administration).pipe(
      catchError((err) => {
        console.error('Failed to add administration', err);
        return of();
      })
    );
  }

  deleteAdministration(residentId: number, medicationId: number, administrationId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}${residentId}/medicaments/${medicationId}/administration/${administrationId}`).pipe(
      catchError((err) => {
        console.error('Failed to delete administration', err);
        return of();
      })
    );
  }
}
