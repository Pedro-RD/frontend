import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast/toast.service';
import { Employee, EmployeeDTO, UserEmployee } from '../../interfaces/employee';
import { catchError, map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../interfaces/user';

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
  fetchItem(id: number): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.url}/${id}`).pipe(
      tap((employee) => {
        if (!environment.production) console.log('Fetched employee:', employee);
      }),
      catchError((error) => {
        if (!environment.production) console.error('Error fetching user:', error);
        throw error;
      })
    );
  }

  //create
  create(item: EmployeeDTO): Observable<Employee> {
    if (!environment.production) console.log('Creating employee:', item);
    return this.httpClient.post<Employee>(this.url, item).pipe(
      map(employee => {
        if (!environment.production) console.log('Employee created:', employee);
        this.toastService.success('Funcionário criado com sucesso');
        return employee;
      }),
      catchError((error) => {
        if (!environment.production) console.log('Error creating employee:', error);
        throw error;
      })
    );
  }

  //update
  update(employeeData: Partial<Employee>): Observable<Employee> {
    if (!environment.production) console.log('Updating employee:', employeeData);
    return this.httpClient.patch<Employee>(`${this.url}/${employeeData.id}`, employeeData).pipe(
      map(employee => {
        if (!environment.production) console.log('Funcionário atualizado com sucesso:', employee);
        this.toastService.success('Funcionário atualizado com sucesso');
        return employee;
      }),
      catchError((error) => {
        if (!environment.production) console.error('Error updating employee:', error);
        throw error;
      })
    );  }

}
