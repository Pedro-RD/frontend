import { User } from '../../../interfaces/user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  map,
  Observable,
  interval,
  Subscription,
  mergeMap,
  tap,
  startWith,
} from 'rxjs';
import {
  AsyncPipe,
  DatePipe,
  NgComponentOutlet,
  NgFor,
  NgIf,
  NgOptimizedImage,
} from '@angular/common';

import { AuthService } from '../../../services/auth/auth.service';
import { NavbarPublicComponent } from '../navbar-public/navbar-public.component';
import { Role } from '../../../interfaces/roles.enum';
import { NavbarManagerComponent } from '../navbar-manager/navbar-manager.component';
import { NavbarCaretakerComponent } from '../navbar-caretaker/navbar-caretaker.component';
import { NavbarRelativeComponent } from '../navbar-relative/navbar-relative.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import {
  NotificationType,
  TasksService,
} from '../../../services/tasks/tasks.service';
import { TaskComponent } from '../../task/task.component';
import { NotificationService } from '../../../services/notification/notification.service';
import { TaskFilterComponent } from '../../task-filter/task-filter.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-navbar-main',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,
    NgComponentOutlet,
    SidebarComponent,
    TaskComponent,
    DatePipe,
    NgIf,
    NgFor,
    TaskFilterComponent,
  ],
  templateUrl: './navbar-main.component.html',
})
export class NavbarMainComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private taskService: TasksService,
    private notificationService: NotificationService,
  ) {}

  private subscriptions: Subscription[] = [];

  messagesVisible = false; // Variável para controlar a visibilidade do submenu de mensagens

  get tasks() {
    return this.taskService.tasks$;
  }
  get notifications() {
    return this.notificationService.notifications$;
  }

  ngOnInit() {
    console.log('NavbarMainComponent initialized');
    // Atualiza notificações a cada 60 segundos
    this.subscriptions.push(
      interval(50000)
        .pipe(
          startWith(0),
          tap(() => {
            !environment.production &&
              console.log('Atualizando notificações...');
          }),
          mergeMap(() => this.notificationService.loadNotifications()),
        )
        .subscribe({
          error: (err) => {
            !environment.production &&
              console.error('Erro ao atualizar notificações:', err);
          },
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  deleteNotification(): void {
    this.subscriptions.push(
      this.notificationService.deleteNotifications().subscribe({
        next: () => {
          !environment.production && console.log('Notificações apagadas');
        },
        error: (err) => {
          !environment.production &&
            console.error('Erro ao apagar notificações:', err);
        },
      }),
    );
  }

  get loggedIn(): Observable<boolean> {
    return this.authService.getUser().pipe(map((user: User | null) => !!user));
  }

  get user(): Observable<User | null> {
    return this.authService.getUser();
  }

  get navbarLinks() {
    return this.authService.getUser().pipe(
      map((user: User | null) => {
        switch (user?.role) {
          case Role.Manager:
            return NavbarManagerComponent;
          case Role.Caretaker:
            return NavbarCaretakerComponent;
          case Role.Relative:
            return NavbarRelativeComponent;
          default:
            return NavbarPublicComponent;
        }
      }),
    );
  }

  logout() {
    this.authService.logout();
  }

  getNotificationType(type: string): string {
    switch (type) {
      case NotificationType.MESSAGE_RELATIVE:
        return 'info.svg';
      case NotificationType.SHIFT:
        return 'info-green.svg';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
