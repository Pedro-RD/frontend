import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  onClick = output();
  
  type = input.required<'button' | 'submit'>();
  label = input.required<string>();
}
