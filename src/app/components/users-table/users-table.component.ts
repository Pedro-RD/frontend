import {NgForOf} from '@angular/common';
import {Component, computed, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UsersService} from '../../services/users/users.service';
import {UsersTableRowComponent} from '../users-table-row/users-table-row.component';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [NgForOf, UsersTableRowComponent],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css',
})
export class UsersTableComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  users = computed(() => this.usersService.listSignal());

  constructor(private usersService: UsersService) {
  }

  ngOnInit() {
    this.updateTable()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.usersService.clearAll();
  }

  handleHeaderClick(col: string) {
    this.usersService.setOrderBy(col);
    this.updateTable();
  }

  updateTable() {
    this.subscriptions.push(this.usersService.fetchList().subscribe());
  }

  deleteUser($event: number) {
    this.subscriptions.push(this.usersService.delete($event).subscribe())
  }
}
