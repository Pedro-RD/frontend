import {Component, input} from '@angular/core';
import {IdentifiableEntity, TableColumn} from '../../../interfaces/table.interface';

interface InputSignal<T> {
  [key: string]: any;
}

@Component({
  selector: '[app-table-row]',
  standalone: true,
  imports: [],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css'
})
export class TableRowComponent<T extends IdentifiableEntity> {
  row = input.required<T>();
  columns = input.required<TableColumn<T>[]>();

  getValue(col: string | keyof T): string {
    const r = this.row();
    const column = this.columns().find(c => c.key === col);

    if (!column) {
      return '';
    }

    const value = this.getNestedValue(r, column.key);

    if (column.formatter && value !== undefined) {
      return column.formatter(value);
    }

    if (value === undefined || value === null) {
      return column.default || '';
    }

    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  }

  private getNestedValue(obj: any, path: string): any {
    if (!path.includes('.')) {
      return obj[path];
    }

    return path.split('.').reduce((current, key) => {
      return current && typeof current === 'object' ? current[key] : undefined;
    }, obj);
  }
}
