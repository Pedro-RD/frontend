import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserRxpDTO } from '../../interfaces/user';
import { sub } from 'date-fns';
import { TasksService } from '../tasks/tasks.service';
import { Role } from '../../interfaces/roles.enum';

interface AuthInfo {
  access_token: string;
  user: UserRxpDTO;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private subject;

  private readonly url: string = environment.apiUrl + 'auth';
  private readonly token_key = 'auth-token';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private tasksService: TasksService,
  ) {
    this.subject = new BehaviorSubject<AuthInfo | null>(this.getLoginInfo());
  }

  public login(email: string, password: string): Observable<User> {
    return this.httpClient
      .post<AuthInfo>(this.url + '/login', { email, password })
      .pipe(
        map((rxp) => {
          this.saveLoginInfo(rxp);
          this.subject.next(rxp);
          if (rxp.user.role !== Role.Relative) {
            this.tasksService.connect(rxp.access_token);
          }
          return rxp.user;
        }),
      );
  }

  public getToken(): Observable<string | null> {
    return this.subject
      .asObservable()
      .pipe(map((x) => x?.access_token || null));
  }

  public getUser(): Observable<UserRxpDTO | null> {
    return this.subject.asObservable().pipe(map((x) => x?.user || null));
  }

  public logout(): void {
    this.deleteLoginInfo();
    this.subject.next(null);
    this.tasksService.disconnect();
    this.router.navigate(['login']);
  }

  private saveLoginInfo(authInfo: AuthInfo) {
    localStorage.setItem(this.token_key, JSON.stringify(authInfo));
  }

  private deleteLoginInfo() {
    localStorage.removeItem(this.token_key);
  }

  private getLoginInfo(): AuthInfo | null {
    const info = localStorage.getItem(this.token_key);
    if (!info) return null;
    this.tasksService.connect(JSON.parse(info).access_token);
    return JSON.parse(info);
  }

  validateSavedToken() {
    const info = this.getLoginInfo();
    if (info) {
      this.httpClient
        .get(this.url + '/profile', {
          headers: {
            Authorization: `Bearer ${info.access_token}`,
          },
        })
        .subscribe({
          error: () => {
            this.deleteLoginInfo();
            this.subject.next(null);
            this.tasksService.disconnect();
            this.router.navigate(['/']);
          },
        });
    }
  }

  public resetPassword(userId: number, password: string): Observable<void> {
    const url = `${environment.apiUrl}users/${userId}/password`; // Dynamic userId in the URL
    const payload = { password }; // Send only the "password" field

    return this.httpClient.patch<void>(url, payload).pipe(
      map(() => {
        console.log('Password reset successfully');
      })
    );
  }

  public isRelative(): Observable<boolean> {
    return this.getUser().pipe(map((user) => user?.role === Role.Relative));

  }
  public isManager(): Observable<boolean> {
    return this.getUser().pipe(map((user) => user?.role === Role.Manager));
  }

}
