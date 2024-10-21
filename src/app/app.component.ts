import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarMainComponent} from './components/navbars/navbar-main/navbar-main.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarMainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
