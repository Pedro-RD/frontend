import { Component, OnInit } from '@angular/core';
import { CookieService } from '../../services/cookie/cookie.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-cookie-notification',
  standalone: true,
  imports:[NgIf],
  templateUrl: './cookie-notification.component.html',
  styleUrls: ['./cookie-notification.component.css']
})
export class CookieNotificationComponent implements OnInit {
  cookiesAccepted: boolean = false;

  constructor(private cookieService: CookieService) {}

  ngOnInit(): void {
    this.cookiesAccepted = this.cookieService.hasAcceptedCookies();
  }

  acceptCookies(): void {
    this.cookieService.acceptCookies();
    this.cookiesAccepted = true;
  }
}
