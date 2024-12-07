import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserRxpDTO } from '../../interfaces/user';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-not-allowed',
  standalone: true,
  imports: [
    RouterLink,
  ],
  templateUrl: './not-allowed.component.html',
  styleUrl: './not-allowed.component.css'
})
export class NotAllowedComponent {
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
