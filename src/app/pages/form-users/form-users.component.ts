import { Component } from '@angular/core';
import {InputComponent} from '../../components/forms/input/input.component';

@Component({
  selector: 'app-form-users',
  standalone: true,
  imports: [
    InputComponent
  ],
  templateUrl: './form-users.component.html',
  styleUrl: './form-users.component.css'
})
export class FormUsersComponent {

}
