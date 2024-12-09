import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {


  private isDragging = false;
  private startY = 0;
  private scrollTop = 0;

  // Start dragging
  startDrag(event: MouseEvent): void {
    const container = this.getScrollableContainer(event);
    this.isDragging = true;
    this.startY = event.pageY - container.offsetTop;
    this.scrollTop = container.scrollTop;
    container.style.cursor = 'grabbing'; // Visual feedback
    document.body.style.userSelect = 'none'; // Disable text selection globally
  }

  // Handle dragging
  onDrag(event: MouseEvent): void {
    if (!this.isDragging) return;

    const container = this.getScrollableContainer(event);
    event.preventDefault();
    const y = event.pageY - container.offsetTop;
    const walk = (y - this.startY) * 2; // Adjust scroll speed
    container.scrollTop = this.scrollTop - walk;
  }

  stopDrag(): void {
    this.isDragging = false;
    const container = document.querySelector('.drawer-side') as HTMLElement;
    if (container) {
      container.style.cursor = 'pointer'; // Restore cursor
    }
    document.body.style.userSelect = ''; // Restore text selection
  }

  private getScrollableContainer(event: MouseEvent): HTMLElement {
    let target = event.target as HTMLElement;
    while (!target.classList.contains('drawer-side') && target.parentElement) {
      target = target.parentElement;
    }
    return target;
  }
}
