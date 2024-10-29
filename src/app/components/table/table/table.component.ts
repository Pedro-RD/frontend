import {Component, input, output} from '@angular/core';
import {UsersTableRowComponent} from '../../old/users-table-row/users-table-row.component';
import {TableConfig,} from '../../../interfaces/table.interface';
import {NgClass} from '@angular/common';
import {TableCellProfileComponent} from '../table-cell-profile/table-cell-profile.component';
import {TableCellTextComponent} from '../table-cell-text/table-cell-text.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [UsersTableRowComponent, NgClass, TableCellProfileComponent, TableCellTextComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent<T> {
  tableConfig = input.required<TableConfig<T>>();
  data = input.required<T[]>();
  headerClicked = output<string>();

  handleHeaderClicked(key: string): void {
    this.headerClicked.emit(key);
  }

  getValue<T>(obj: T, key: string): any {
    return (obj as { [key: string]: any })[key];
  }
}
