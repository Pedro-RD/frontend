import { Component, inject, input } from '@angular/core';
import {
  NotificationMessage,
  NotificationStatus,
  NotificationType,
  TasksService,
} from '../../services/tasks/tasks.service';
import { DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [DatePipe, RouterModule],
  templateUrl: './task.component.html',
})
export class TaskComponent {
  taskService = inject(TasksService);
  router = inject(Router);
  task = input.required<NotificationMessage>();

  get NotificationStatus() {
    return NotificationStatus;
  }

  get NotificationType() {
    return NotificationType;
  }

  setTaskAsOngoing() {
    this.taskService.setTaskAsOngoing(this.task().id);
  }

  setTaskAsDone() {
    this.taskService.setTaskAsDone(this.task().id);
  }

  setTaskAsCanceled() {
    this.taskService.setTaskAsCanceled(this.task().id);
  }

  seeResident(task: NotificationMessage) {
    switch (task.type) {
      case NotificationType.MEDICAMENT:
      case NotificationType.MEDICAMENT_STOCK:
      case NotificationType.MEDICAMENT_LOW:
        return this.router.navigate([
          'residents',
          'detail',
          task.medicament.resident.id,
        ]);
      case NotificationType.APPOINTMENT:
        return this.router.navigate([
          'residents',
          'detail',
          task.appointment.resident.id,
        ]);
      case NotificationType.MESSAGE:
        return this.router.navigate([
          'residents',
          'detail',
          task.userMessage.resident.id,
        ]);
      default:
        return;
    }
  }
  seeTask(task: NotificationMessage) {
    switch (task.type) {
      case NotificationType.MEDICAMENT:
      case NotificationType.MEDICAMENT_STOCK:
      case NotificationType.MEDICAMENT_LOW:
        return this.router.navigate([
          'residents',
          task.medicament.resident.id,
          'medicaments',
          task.medicament.id,
        ]);
      case NotificationType.APPOINTMENT:
        return this.router.navigate([
          'residents',
          task.appointment.resident.id,
          'appointments',
          task.appointment.id,
        ]);

      case NotificationType.MESSAGE:
        return this.router.navigate([
          'residents',
          task.userMessage.resident.id,
          'messages',
          task.userMessage.id,
        ]);
      default:
        return;
    }
  }
}
