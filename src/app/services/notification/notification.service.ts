import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { merge, mergeMap, Observable, of, take } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Role } from '../../interfaces/roles.enum';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly url: string = `${environment.apiUrl}notifications/messages`;
  private readonly urlshifts: string = `${environment.apiUrl}notifications/shifts`;

  notifications = signal<any[]>([]);  // Signal para armazenar notificações

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadNotifications();  // Carregar notificações ao iniciar o serviço
  }

  /**
   * Faz uma chamada para a API e carrega as notificações.
   */
  loadNotifications(): void {
    this.authService.getUser().pipe(
      take(1),
      mergeMap((user) => {
        if(!user) {
          return of([]);
        }

        switch (user.role){
          case Role.Relative:
            return this.http.get<any[]>(this.url);
          default:
            return this.http.get<any[]>(this.urlshifts)
        }
      })
    ).subscribe({
      next: (data) => {
        //console.log('Notificações carregadas do servidor:', data);
        this.notifications.set(data);  // Atualiza o Signal com as notificações recebidas
      },
      error: (err) => console.error('Erro ao buscar notificações:', err),
    });
  }

  deleteNotification(notificationId: number): void {
    this.authService.getUser().pipe(
      take(1),
      mergeMap((user) => {
        if (!user) {
          return of([]);
        }
  
        let urlToDelete: string;
        switch (user.role) {
          case Role.Relative:
            urlToDelete = `${this.url}/${notificationId}`;  // URL para excluir a notificação específica
            break;
          default:
            urlToDelete = `${this.urlshifts}/${notificationId}`;  // URL para excluir a notificação específica
            break;
        }
  
        return this.http.delete<any>(urlToDelete);  // Chama o DELETE com a URL apropriada
      })
    ).subscribe({
      next: () => {
        // Remove a notificação localmente após a exclusão
        this.removeNotification(notificationId);  // Método para atualizar o Signal local
      },
      error: (err) => console.error('Erro ao excluir notificação:', err),
    });
  }
  

  

  /**
   * Marca uma notificação como lida.
   * @param notificationId ID da notificação a ser marcada.
   */
  markAsRead(notificationId: number): Observable<any> {
    const url = `${this.url}/${notificationId}`;
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.patch(url, { status: 'Lida' }, { headers });
  }

  /**
   * Remove notificações lidas localmente.
   * @param notificationId ID da notificação a ser removida.
   */
  removeNotification(notificationId: number): void {
    const updated = this.notifications().filter((n) => n.id !== notificationId);
    this.notifications.set(updated);  // Atualiza as notificações no Signal
  }
}
