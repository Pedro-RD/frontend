import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, combineLatestWith, map } from 'rxjs';
import { User } from '../../interfaces/user';
import { Message } from '../../interfaces/message';
import { Medication } from '../../interfaces/medication';
import { Appointment } from '../../interfaces/appointment';

export enum NotificationType {
  APPOINTMENT = 'Consulta',
  MEDICAMENT = 'Medicamento',
  MEDICAMENT_STOCK = 'Stock de Medicamento',
  MEDICAMENT_LOW = 'Baixo Stock de Medicamento',
  MESSAGE = 'Mensagem',
  MESSAGE_RELATIVE = 'Mensagem Familiar',
  SHIFT = 'Turno',
}

export enum NotificationStatus {
  DONE = 'Concluído',
  CANCELED = 'Cancelado',
  ONGOING = 'Em Curso',
  PENDING = 'Pendente',
}

export interface NotificationMessage {
  id: number;
  message: string;
  type: NotificationType; // Assuming it's always 'Consulta', 'Medicamento', 'Stock de Medicamento', 'Baixo Stock de Medicamento', 'Mensagem', 'Mensagem Familiar', or 'Turno'
  status: NotificationStatus; // Assuming it's always 'Concluído', 'Cancelado', or 'Pendente'
  date: string | null; // Could be a date or null
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
  appointment: Appointment | null; // Assuming this could be an object or null
  medicament: Medication | null; // Assuming this could be an object or null
  userMessage: Message | null; // Assuming this could be an object or null
  user: User | null; // Assuming this could be an object or null
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private taskTypeFilter = new BehaviorSubject<NotificationType | null>(null);
  public taskTypeFilter$ = this.taskTypeFilter.asObservable();

  public setTaskTypeFilter = this.taskTypeFilter.next.bind(this.taskTypeFilter);
  private tasksSubject = new BehaviorSubject<NotificationMessage[]>([]);
  public tasks$ = this.tasksSubject.asObservable().pipe(
    combineLatestWith(this.taskTypeFilter),
    map(([tasks, filter]) => {
      if (!filter) return tasks;
      return tasks.filter((task) =>
        filter === NotificationType.MEDICAMENT_STOCK
          ? task.type === NotificationType.MEDICAMENT ||
            NotificationType.MEDICAMENT_LOW
          : task.type === filter,
      );
    }),
  );

  client?: Socket;

  connect(token: string) {
    console.log('Connecting to socket');
    this.client = io(environment.socketUrl, {
      transports: ['websocket'],
      extraHeaders: {
        authorization: `Bearer ${token}`,
      },
      auth: {
        authorization: `Bearer ${token}`,
      },
    });
    this.client.connect();

    this.client.on('connect', this.handleConnection);

    this.client.on('error', (error) => {
      if (!environment.production) console.error('Socket error', error);
    });

    this.client.on('connect_error', (error) => {
      if (!environment.production)
        console.error('Socket connection error', error);
    });
  }

  disconnect() {
    if (!environment.production) console.log('Disconnecting from socket');
    this.client?.disconnect();
  }

  private handleConnection = () => {
    if (!environment.production) console.log('Socket connected');
    this.client?.on('disconnect', this.handleDisconnection);
    this.client?.on('loadNotifications', this.handleLoadTasks);
  };
  private handleDisconnection = () => {
    if (!environment.production) console.log('Socket disconnected');
    this.tasksSubject.next([]);
  };

  private handleLoadTasks = (tasks: any) => {
    if (!environment.production) console.log('Tasks loaded', tasks);
    this.tasksSubject.next(tasks);
  };

  private changeTaskStatus(id: number, status: NotificationStatus) {
    if (!environment.production)
      console.log('Changing task status', id, status);
    this.client?.emit('updateStatus', { id, status });
  }

  setTaskAsDone(id: number) {
    this.changeTaskStatus(id, NotificationStatus.DONE);
  }

  setTaskAsCanceled(id: number) {
    this.changeTaskStatus(id, NotificationStatus.CANCELED);
  }

  setTaskAsOngoing(id: number) {
    this.changeTaskStatus(id, NotificationStatus.ONGOING);
  }

  setTaskAsPending(id: number) {
    this.changeTaskStatus(id, NotificationStatus.PENDING);
  }

  // Filter methods

  setFilter(filter: NotificationType) {
    this.taskTypeFilter.next(filter);
  }

  clearFilter() {
    this.taskTypeFilter.next(null);
  }
}
