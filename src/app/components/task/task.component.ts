import { Component, inject, input } from '@angular/core';
import {
  NotificationMessage,
  NotificationStatus,
  NotificationType,
  TasksService,
} from '../../services/tasks/tasks.service';
import { AsyncPipe, DatePipe, NgIf, NgSwitchCase } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Resident } from '../../interfaces/resident';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [DatePipe, RouterModule, AsyncPipe, NgIf, NgSwitchCase],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent {
  taskService = inject(TasksService);
  authService = inject(AuthService);

  router = inject(Router);
  task = input.required<NotificationMessage>();

  get resident(): Resident | undefined {
    switch (this.task().type) {
      case NotificationType.MEDICAMENT:
      case NotificationType.MEDICAMENT_STOCK:
      case NotificationType.MEDICAMENT_LOW:
        return this.task().medicament?.resident;
      case NotificationType.APPOINTMENT:
        return this.task().appointment?.resident;
      case NotificationType.MESSAGE:
        return this.task().userMessage?.resident;
      default:
        return undefined;
    }
  }

  get NotificationStatus() {
    return NotificationStatus;
  }

  get NotificationType() {
    return NotificationType;
  }

  get title() {
    switch (this.task().type) {
      case NotificationType.MEDICAMENT:
        return 'Medicação';
      case NotificationType.MEDICAMENT_LOW:
        return 'Baixo Stock de Medicação';
      case NotificationType.MEDICAMENT_STOCK:
        return 'Sem Stock de Medicação';
      case NotificationType.APPOINTMENT:
        return 'Consulta ou exame';
      case NotificationType.MESSAGE:
        return 'Novas mensagens';
      default:
        return '';
    }
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

  setTaskAsPending() {
    this.taskService.setTaskAsPending(this.task().id);
  }

  seeResident(task: NotificationMessage) {
    switch (task.type) {
      case NotificationType.MEDICAMENT:
      case NotificationType.MEDICAMENT_STOCK:
      case NotificationType.MEDICAMENT_LOW:
        return this.router.navigate([
          'residents',
          'detail',
          task.medicament?.resident?.id,
        ]);
      case NotificationType.APPOINTMENT:
        return this.router.navigate([
          'residents',
          'detail',
          task.appointment?.resident?.id,
        ]);
      case NotificationType.MESSAGE:
        return this.router.navigate([
          'residents',
          'detail',
          task.userMessage?.resident?.id,
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
          task.medicament?.resident?.id,
          'medicaments',
          task.medicament?.id,
        ]);
      case NotificationType.APPOINTMENT:
        return this.router.navigate([
          'residents',
          task.appointment?.resident?.id,
          'appointments',
          task.appointment?.id,
        ]);

      case NotificationType.MESSAGE:
        return this.router.navigate([
          'residents',
          task.userMessage?.resident?.id,
          'messages',
        ]);
      default:
        return;
    }
  }
}
