import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-navbar-relative',
  standalone: true,
  imports: [],
  templateUrl: './navbar-relative.component.html',
  styleUrl: './navbar-relative.component.css'
})
export class NavbarRelativeComponent {
  @Input({required: true}) side!: boolean;
}
