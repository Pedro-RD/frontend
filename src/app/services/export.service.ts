import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private urlApi: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  exportToExcel(month: string, year: number) {
    const url = `${this.urlApi}reports?month=${month}&year=${year}`;
    return this.http.get(url, {
      // BLOB: Binary Large Object = file
      responseType: 'blob',
    });
  }
}
