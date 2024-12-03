import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  map,
  Observable
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../interfaces/user';

interface AuthInfo {
  access_token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private subject;

  private readonly url: string = environment.apiUrl + 'auth';
  private readonly token_key = 'auth-token';

  constructor(private httpClient: HttpClient, private router: Router) {
    this.subject = new BehaviorSubject<AuthInfo | null>(this.getLoginInfo());
  }

  public login(email: string, password: string): Observable<User> {
    return this.httpClient
      .post<AuthInfo>(this.url + '/login', { email, password })
      .pipe(
        map((rxp) => {
          this.saveLoginInfo(rxp);
          this.subject.next(rxp);
          return rxp.user;
        })
      );
  }

  public getToken(): Observable<string | null> {
    return this.subject.asObservable().pipe(map((x) => x?.access_token || null));
  }

  public getUser(): Observable<User | null> {
    return this.subject.asObservable().pipe(map((x) => x?.user || null));
  }

  public logout(): void {
    this.deleteLoginInfo();
    this.subject.next(null);
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
    return JSON.parse(info);
  }
}
