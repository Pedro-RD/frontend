import { Injectable } from '@angular/core';
import { ListService } from '../list/list.service';
import { Message, MessageDTO } from '../../interfaces/message';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast/toast.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import PagedResponse from '../../interfaces/paged-response.interface';

@Injectable({
  providedIn: 'root',
})
export class MessageService extends ListService<Message> {
  readonly url: string = environment.apiUrl + 'residents/';

  constructor(
    private httpClient: HttpClient,
    private toastService: ToastService
  ) {
    super();
  }

  fetchList(residentId: number, page: number = 1, limit: number = 10): Observable<Message[]> {
    return this.httpClient.get<PagedResponse<Message>>(
      `${this.url}${residentId}/messages?page=${page}&limit=${limit}`
    ).pipe(
      tap((response) => {
        // Atualiza o total de páginas, se necessário
        if (response.totalPages) {
          this.setTotalPages(response.totalPages);
        }
      }),
      map((response) => response.data), // Retorna apenas os dados das mensagens
      catchError((error) => {
        console.error('Erro ao buscar lista de mensagens:', error);
        // Retorna um array vazio para manter a aplicação funcional
        return of([]);
      })
    );
  }

  // Método para buscar uma mensagem específica
  fetchItem(id: number, residentId: number): Observable<Message> {
    return this.httpClient.get<Message>(`${this.url}${residentId}/messages/${id}`).pipe(
      catchError((err) => {
        console.error('Erro ao buscar mensagem:', err);
        this.toastService.error('Erro ao buscar mensagem');
        return of({} as Message);
      })
    );
  }

  // Método para criar uma nova mensagem
  create(item: MessageDTO, residentId: number): Observable<Message> {
    return this.httpClient.post<Message>(`${this.url}${residentId}/messages`, item).pipe(
      map((message) => {
        this.toastService.success('Mensagem criada com sucesso');
        return message;
      }),
      catchError((error) => {
        console.error('Erro ao criar mensagem:', error);
        this.toastService.error('Erro ao criar mensagem');
        throw error;
      })
    );
  }

  // Método para atualizar uma mensagem
  update(id: number, item: MessageDTO, residentId: number): Observable<Message> {
    const url = `${this.url}${residentId}/messages/${id}`;
    return this.httpClient.patch<Message>(url, item).pipe(
      tap(() => {
        this.toastService.success('Mensagem atualizada com sucesso');
      }),
      catchError((error) => {
        console.error('Erro ao atualizar mensagem:', error);
        this.toastService.error('Erro ao atualizar mensagem');
        return of({} as Message);
      })
    );
  }

  // Variável para evitar múltiplas requisições de deleção simultâneas
  isDeleting = false;

  // Método para excluir uma mensagem
  delete(id: number, residentId: number): Observable<void> {
    if (this.isDeleting) return of(); // Evita múltiplas requisições simultâneas
    this.isDeleting = true;
  
    return this.httpClient.delete<void>(`${this.url}${residentId}/messages/${id}`).pipe(
      map(() => {
        this.isDeleting = false;
        this.toastService.success('Mensagem eliminada com sucesso');
      }),
      catchError((error) => {
        console.error('Erro ao eliminar mensagem:', error);
        this.isDeleting = false;
        this.toastService.error('Erro ao eliminar mensagem');
        throw error; // Propaga o erro para ser tratado no componente
      })
    );
  }
  
}
