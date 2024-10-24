import {AsyncPipe, NgForOf} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UsersService} from '../../services/users/users.service';
import {UsersTableRowComponent} from '../users-table-row/users-table-row.component';
import {Order} from '../../interfaces/paged-response.interface';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    NgForOf,
    UsersTableRowComponent,
    AsyncPipe
  ],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css'
})
export class UsersTableComponent implements OnInit {
  public page = 1;
  public pageSize = 10;
  public orderField = 'id';
  public orderDirection = Order.ASC;
  private subscriptions: Subscription[] = [];

  constructor(private usersService: UsersService) {
  }

  get users() {
    return this.usersService.userList$;
  }

  ngOnInit(): void {
    this.subscriptions.push(this.usersService.getAll(this.page, this.orderDirection, this.pageSize).subscribe());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }


}
