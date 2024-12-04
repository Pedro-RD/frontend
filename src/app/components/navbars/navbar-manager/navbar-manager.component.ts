import { Component, Input, OnInit } from '@angular/core';
import { map, tap } from 'rxjs';
import { User, UserRxpDTO } from '../../../interfaces/user';
import { AuthService } from '../../../services/auth/auth.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar-manager',
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './navbar-manager.component.html',
  styleUrl: './navbar-manager.component.css',
})
export class NavbarManagerComponent implements OnInit {
  @Input({ required: true }) side!: boolean;
  employeeId: number | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    return this.authService
      .getUser()
      .pipe(
        tap((user) => console.log('User: ', user)),
        map((user: UserRxpDTO | null) => user?.employee?.id),
      )
      .subscribe((id) => {
        if (id) {
          this.employeeId = id;
        }
      });
  }
}
