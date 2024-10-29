import { Component, input, output } from '@angular/core';
import { NgForOf } from '@angular/common';
import { UsersTableRowComponent } from '../../old/users-table-row/users-table-row.component';
import {
  IdentifiableEntity,
  TableConfig,
} from '../../../interfaces/table.interface';
import { TableRowComponent } from '../table-row/table-row.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgForOf, UsersTableRowComponent, TableRowComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent<T extends IdentifiableEntity> {
  tableConfig = input.required<TableConfig<T>>();
  data = input.required<T[]>();
  headerClicked = output<string>();

  handleHeaderClicked(key: string): void {
    this.headerClicked.emit(key);
  }
}
