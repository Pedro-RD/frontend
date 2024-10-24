import {NgForOf} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {UsersTableRowComponent} from '../users-table-row/users-table-row.component';
import {UsersService} from '../../services/users/users.service';
import {User} from '../../interfaces/user';
import {Subscription, tap} from 'rxjs';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [NgForOf, UsersTableRowComponent],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css',
})
export class UsersTableComponent implements OnInit, OnDestroy {
  public users: User[] = []
  private subscription!: Subscription;

  constructor(private usersService: UsersService) {
  }

  ngOnInit() {
    this.subscription = this.usersService
      .getAll()
      .pipe(
        tap(({response, query}) => {
          this.users = response.data;
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}
