import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicationService {
  private apiUrl = 'http://sua-api-url/medications';

  constructor(private http: HttpClient) {}

  getMedications(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
