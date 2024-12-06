import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { AsyncPipe } from '@angular/common';
import { map, tap } from 'rxjs';
import { UserRxpDTO } from '../../../interfaces/user';

@Component({
  selector: 'app-navbar-caretaker',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    AsyncPipe
  ],
  templateUrl: './navbar-caretaker.component.html',
  styleUrl: './navbar-caretaker.component.css'
})
export class NavbarCaretakerComponent implements OnInit{
  @Input({required: true}) side!: boolean;
  employeeId: number | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    return this.authService.getUser().pipe(
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
