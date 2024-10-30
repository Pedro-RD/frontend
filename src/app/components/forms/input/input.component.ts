import {Component, input} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
  label = input.required<string>();
  placeholder = input.required<string>();
  type = input<string>();
  // formControl = input.required<FormControl>();
}
