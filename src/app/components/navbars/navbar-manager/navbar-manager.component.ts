import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-navbar-manager',
  standalone: true,
  imports: [],
  templateUrl: './navbar-manager.component.html',
  styleUrl: './navbar-manager.component.css'
})
export class NavbarManagerComponent {
  @Input({required: true}) side!: boolean;
}
