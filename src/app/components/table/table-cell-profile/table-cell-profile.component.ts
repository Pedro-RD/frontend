import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table-cell-profile',
  standalone: true,
  imports: [],
  templateUrl: './table-cell-profile.component.html',
  styleUrl: './table-cell-profile.component.css',
})
export class TableCellProfileComponent {
  imgUrl = input<string>();
  mainText = input.required<string>();
  subText = input<string>();
}
