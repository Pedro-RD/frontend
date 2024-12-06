import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast/toast.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagerDashboardService  {
  readonly url: string = environment.apiUrl + 'dashboards';

  constructor(private http: HttpClient) {}

  getManagerDashboard(): Observable<any> {
    return this.http.get(`${this.url}/manager`);
  }

  getCaretakerDashboard(): Observable<any> {
    return this.http.get(`${this.url}/caretaker`);
  }

  getRelativeDashboard(): Observable<any> {
    return this.http.get(`${this.url}/relative}`);
  }








}
