import { Component, inject } from '@angular/core';
import {
  NotificationType,
  TasksService,
} from '../../services/tasks/tasks.service';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [NgClass, AsyncPipe],
  templateUrl: './task-filter.component.html',
})
export class TaskFilterComponent {
  private readonly taskService = inject(TasksService);

  get NotificationType() {
    return NotificationType;
  }

  get filter() {
    return this.taskService.taskTypeFilter$;
  }

  public filterAdministrations() {
    this.taskService.setFilter(NotificationType.MEDICAMENT);
  }

  public filterMessages() {
    this.taskService.setFilter(NotificationType.MESSAGE);
  }

  public filterAppointments() {
    this.taskService.setFilter(NotificationType.APPOINTMENT);
  }

  public filterStock() {
    this.taskService.setFilter(NotificationType.MEDICAMENT_STOCK);
  }

  public clearFilter() {
    this.taskService.clearFilter();
  }
}
