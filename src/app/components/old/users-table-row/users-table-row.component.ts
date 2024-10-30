import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf} from '@angular/common';
import {User} from '../../../interfaces/user';

@Component({
  selector: '[app-users-table-row]',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './users-table-row.component.html',
  styleUrl: './users-table-row.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersTableRowComponent {
  @Input({required: true}) user!: User;
  @Output() deleteUser = new EventEmitter<number>();

  handleDelete(): void {
    this.deleteUser.emit(this.user.id);
  }
}
