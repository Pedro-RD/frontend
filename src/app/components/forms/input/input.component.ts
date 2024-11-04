import {Component, computed, input} from '@angular/core';
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
  required = input<boolean>();
  control = input.required<FormControl>();

  valid = computed(() => {
    return this.control().touched && this.control().valid
  })


  // Using computed signal for error messages
  errorMessage = computed(() => {
    // const control = this.control();
    //
    // if (control.invalid && control.touched) {
    //   if (control.errors?.['required']) {
    //     return 'This field is required';
    //   }
    //   if (control.errors?.['email']) {
    //     return 'Please enter a valid email';
    //   }
    //   if (control.errors?.['minlength']) {
    //     return `Minimum length is ${control.errors['minlength'].requiredLength}`;
    //   }
    //   if (control.errors?.['maxlength']) {
    //     return `Maximum length is ${control.errors['maxlength'].requiredLength}`;
    //   }
    //   if (control.errors?.['pattern']) {
    //     return 'Invalid format';
    //   }
    //   // Add more error cases as needed
    // }
    return '';
  });
}
