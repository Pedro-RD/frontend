import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, mergeMap, of, pipe, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Role } from '../../interfaces/roles.enum';

interface Notification {
  id: number;
  message: string;
  type: string;
  status: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly url: string = `${environment.apiUrl}notifications/messages`;
  private readonly urlshifts: string = `${environment.apiUrl}notifications/shifts`;

  private readonly notifications = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notifications.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Faz uma chamada para a API e carrega as notificações.
   */
  loadNotifications() {
    return this.authService.getUser().pipe(
      take(1),
      mergeMap((user) => {
        if (!user) {
          return of([]);
        }

        return user.role === Role.Relative
          ? this.http.get<Notification[]>(this.url)
          : this.http.get<Notification[]>(this.urlshifts);
      }),
      pipe(
        tap((notifications) => this.notifications.next(notifications)),
        tap(
          (notifications) =>
            !environment.production && console.log(notifications),
        ),
      ),
    );
  }

  deleteNotifications() {
    return this.authService.getUser().pipe(
      take(1),
      mergeMap((user) => {
        if (!user) {
          return of([]);
        }
        return this.http.delete<void>(
          user.role === Role.Relative ? this.url : this.urlshifts,
        );
      }),
      tap(() => {
        this.notifications.next([]);
      }),
    );
  }
}
