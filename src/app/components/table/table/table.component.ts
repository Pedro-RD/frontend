import {Component, input, output} from '@angular/core';
import {UsersTableRowComponent} from '../../old/users-table-row/users-table-row.component';
import {ColumnType, Entity, TableConfig,} from '../../../interfaces/table.interface';
import {DatePipe, NgClass} from '@angular/common';
import {TableCellProfileComponent} from '../table-cell-profile/table-cell-profile.component';
import {TableCellTextComponent} from '../table-cell-text/table-cell-text.component';
import {Order} from '../../../interfaces/paged-response.interface';
import {Location} from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [UsersTableRowComponent, NgClass, TableCellProfileComponent, TableCellTextComponent, DatePipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent<T extends Entity> {
  constructor(private location: Location) {}

  tableConfig = input.required<TableConfig<T>>();
  data = input.required<T[]>();

  orderKey = input<string>();
  orderDirection = input<Order>();

  headerClicked = output<string>();
  rowClicked = output<number>();

  handleHeaderClicked(key: string): void {
    this.headerClicked.emit(key);
  }

  handleRowClicked(key: number): void {
    this.rowClicked.emit(key);
  }

  getValue<T>(obj: T, key: string): any {
    return (obj as { [key: string]: any })[key];
  }

  goBack(): void {
    this.location.back();
  }

  protected readonly Order = Order;
  protected readonly ColumnType = ColumnType;
}
