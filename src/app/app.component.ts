import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarMainComponent } from './components/navbars/navbar-main/navbar-main.component';
import { ToastComponent } from './components/toast/toast.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CookieNotificationComponent } from './pages/cookie-notification/cookie-notification.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GoogleMapsModule } from '@angular/google-maps';
import { AuthService } from './services/auth/auth.service';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingPageComponent } from './components/loading-page/loading-page.component';
import { LoadingService } from './services/helpers/loading.service';
import { environment } from '../environments/environment';
import { ModalErrorComponent } from './components/modal-error/modal-error.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarMainComponent,
    ToastComponent,
    FullCalendarModule,
    CookieNotificationComponent,
    NgxChartsModule,
    GoogleMapsModule,
    FooterComponent,
    LoadingPageComponent,
    ModalErrorComponent,
  ],

  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  loadingService = inject(LoadingService);
  title = 'Aconchego';

  ngOnInit(): void {
    this.authService.validateSavedToken();
    this.loadingService.loading$.subscribe();
  }
}
