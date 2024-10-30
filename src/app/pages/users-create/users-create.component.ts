import { Component } from '@angular/core';
import {FormUsersComponent} from "../form-users/form-users.component";

@Component({
  selector: 'app-users-create',
  standalone: true,
    imports: [
        FormUsersComponent
    ],
  templateUrl: './users-create.component.html',
  styleUrl: './users-create.component.css'
})
export class UsersCreateComponent {

}
