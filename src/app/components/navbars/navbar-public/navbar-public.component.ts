import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-navbar-public',
  standalone: true,
  imports: [],
  templateUrl: './navbar-public.component.html',
  styleUrl: './navbar-public.component.css'
})
export class NavbarPublicComponent {
  @Input({required: true}) side!: boolean;
}
