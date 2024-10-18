import {Component, Input, input} from '@angular/core';
import {NgForOf} from "@angular/common";
import {User} from '../../interfaces/user';

@Component({
  selector: 'app-users-table-row',
  standalone: true,
    imports: [
        NgForOf
    ],
  templateUrl: './users-table-row.component.html',
  styleUrl: './users-table-row.component.css'
})
export class UsersTableRowComponent {

  @Input() user!: User;

}
