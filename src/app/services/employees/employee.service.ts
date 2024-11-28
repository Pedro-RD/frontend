import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast/toast.service';
import { Employee, EmployeeDTO } from '../../interfaces/employee';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  readonly url: string = environment.apiUrl + 'employees';

  constructor(
    private httpClient: HttpClient,
    private toastService: ToastService,
  ) {
    // super();
  }
  //findOne
  //update

  create(item: EmployeeDTO): Observable<Employee> {
    if (!environment.production) console.log('Creating employee:', item);
    return this.httpClient.post<Employee>(this.url, item).pipe(
      map(employee => {
        if (!environment.production) console.log('Employee created:', employee);
        this.toastService.success('Employee created successfully');
        return employee;
      }),
      catchError((error) => {
        if (!environment.production) console.log('Error creating employee:', error);
        throw error;
      })
    );
  }

}
