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
  private readonly url: string = environment.apiUrl + 'medications/';

  constructor(private httpClient: HttpClient) {}

  getAdministrations(medicationId: number): Observable<Administration[]> {
    return this.httpClient.get<Administration[]>(`${this.url}${medicationId}/administration`).pipe(
      catchError((err) => {
        console.error('Failed to load administrations', err);
        return of([] as Administration[]);
      })
    );
  }
}
