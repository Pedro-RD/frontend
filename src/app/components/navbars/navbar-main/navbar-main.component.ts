import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { map, Observable, interval } from 'rxjs';
import {
  AsyncPipe,
  NgComponentOutlet,
  NgIf,
  NgFor,
  DatePipe,
} from '@angular/common';

import { AuthService } from '../../../services/auth/auth.service';
import { User } from '../../../interfaces/user';
import { NavbarPublicComponent } from '../navbar-public/navbar-public.component';
import { Role } from '../../../interfaces/roles.enum';
import { NavbarManagerComponent } from '../navbar-manager/navbar-manager.component';
import { NavbarCaretakerComponent } from '../navbar-caretaker/navbar-caretaker.component';
import { NavbarRelativeComponent } from '../navbar-relative/navbar-relative.component';
import { NotificationService } from '../../../services/notification/notification.service';

interface Notification {
  id: number;
  message: string;
  type: string;
  status: string;
  createdAt: string;
}

@Component({
  selector: 'app-navbar-main',
  standalone: true,
  imports: [RouterLink, AsyncPipe, NgIf, NgFor, NgComponentOutlet, DatePipe],
  templateUrl: './navbar-main.component.html',
  styleUrls: ['./navbar-main.component.css'],
})
export class NavbarMainComponent implements OnInit {
  messagesVisible = false; // Variável para controlar a visibilidade do submenu de mensagens

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService,
  ) {}

  get notifications() {
    return this.notificationService.notifications();
  }

  ngOnInit() {
    // Atualiza notificações a cada 60 segundos
    interval(60000).subscribe(() =>
      this.notificationService.loadNotifications(),
    );
  }

  deleteNotification(notificationId: number): void {
    this.notificationService.deleteNotification(notificationId); // Passa o ID da notificação
  }

  get loggedIn(): Observable<boolean> {
    return this.authService.getUser().pipe(map((user: User | null) => !!user));
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
}
