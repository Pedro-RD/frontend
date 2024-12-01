import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavbarMainComponent} from './components/navbars/navbar-main/navbar-main.component';
import {ToastComponent} from './components/toast/toast.component';
import { FullCalendarModule } from '@fullcalendar/angular';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarMainComponent, ToastComponent, FullCalendarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
