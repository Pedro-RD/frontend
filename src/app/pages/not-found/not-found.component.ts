import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UserRxpDTO } from '../../interfaces/user';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    RouterLink,
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent implements OnInit {
  user: UserRxpDTO | null = null; // Store the user object or null

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Fetch the user data on initialization
    this.authService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  // Determine the navigation route based on the user object
  getNavigationRoute(): string {
    return this.user ? '/dashboard' : '/';
  }
}
