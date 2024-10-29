import {Component, input, output} from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent {
  pageNumber = input.required<number>();
  totalPages = input.required<number>();

  nextPage = output();
  previousPage = output();

  arrowLeft(): boolean {
    return (this.pageNumber() || 1) > 1;
  }

  arrowRight(): boolean {
    if (!this.pageNumber() || !this.totalPages()) return false;
    return this.pageNumber()! <= this.totalPages()!;

  }

  handleArrowLeftClick(): void {
    this.previousPage.emit();
  }

  handleArrowRightClick(): void {
    this.nextPage.emit();
  }
}
