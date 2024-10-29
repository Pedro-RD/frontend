import {Component, input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-table-cell-text',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './table-cell-text.component.html',
  styleUrl: './table-cell-text.component.css'
})
export class TableCellTextComponent {
  mainText = input.required<string>()
  subText = input<string>()
}
