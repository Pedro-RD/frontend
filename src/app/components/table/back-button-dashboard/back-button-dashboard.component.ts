import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-back-button-dashboard',
  standalone: true,
  imports: [
    RouterLink,
  ],
  templateUrl: './back-button-dashboard.component.html',
  styleUrl: './back-button-dashboard.component.css'
})
export class BackButtonDashboardComponent {

}
