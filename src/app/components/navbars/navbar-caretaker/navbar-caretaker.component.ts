import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-navbar-caretaker',
  standalone: true,
  imports: [],
  templateUrl: './navbar-caretaker.component.html',
  styleUrl: './navbar-caretaker.component.css'
})
export class NavbarCaretakerComponent {
  @Input({required: true}) side!: boolean;
}
