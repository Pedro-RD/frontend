import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

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
  appointment: any | null; // Assuming this could be an object or null
  medicament: any | null; // Assuming this could be an object or null
  userMessage: any | null; // Assuming this could be an object or null
  user: any | null; // Assuming this could be an object or null
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private tasksSubject = new BehaviorSubject<NotificationMessage[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  client?: Socket;
  constructor() {}

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
    this.client.on('disconnect', this.handleDisconnection);
    this.client.on('loadNotifications', this.handleLoadTasks);

    this.client.on('error', (error) => {
      console.error('Socket error', error);
    });

    this.client.on('connect_error', (error) => {
      console.error('Socket connection error', error);
    });
  }
  private handleConnection = () => {
    console.log('Socket connected');
  };
  private handleDisconnection = () => {
    console.log('Socket disconnected');
  };

  private handleLoadTasks = (tasks: any) => {
    console.log('Tasks loaded', tasks);
    this.tasksSubject.next(tasks);
  };

  private changeTaskStatus(id: number, status: NotificationStatus) {
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
}
