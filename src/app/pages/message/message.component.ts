import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Message, MessageDTO } from '../../interfaces/message';
import { MessageService } from '../../../app/services/messages/message.service';
import { AuthService } from '../../../app/services/auth/auth.service';
import { Role } from '../../interfaces/roles.enum';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  form: FormGroup;
  residentId: number | null = null;
  isEditing: boolean = false;
  loggedUserId: number | null = null;
  private pollingSubscription: Subscription | null = null;
  currentPage: number = 1;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private renderer: Renderer2
  ) {
    this.form = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(255)]],
    });
  }

  ngOnInit(): void {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      this.renderer.removeClass(mainElement, 'container');
      this.renderer.removeClass(mainElement, 'px-2');
      this.renderer.removeClass(mainElement, 'sm:px-0');
      this.renderer.removeClass(mainElement, 'mx-auto');
      this.renderer.removeClass(mainElement, 'pt-10');

    }

    const idFromRoute = this.route.snapshot.params['residentId'];
    if (idFromRoute) {
      this.residentId = +idFromRoute;
    }

    // Obtém o ID do usuário logado via AuthService
    this.authService
      .getUser()
      .pipe(take(1))
      .subscribe((user) => {
        this.loggedUserId = user?.id || null;
      });

    if (this.residentId) {
      this.loadMessages();
      this.startPolling();
    }
  }

  ngOnDestroy(): void {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      this.renderer.addClass(mainElement, 'container');
      this.renderer.addClass(mainElement, 'px-2');
      this.renderer.addClass(mainElement, 'sm:px-0');
      this.renderer.addClass(mainElement, 'mx-auto');
      this.renderer.addClass(mainElement, 'pt-10');
    }

    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  loadMessages(): void {
    if (this.residentId) {
      this.messageService.fetchList(this.residentId).subscribe({
        next: (response) => {
          this.messages = response.reverse();
        },
        error: (err) => {
          console.error('Erro ao carregar mensagens:', err);
        },
      });
    }
  }

  startPolling(): void {
    this.pollingSubscription = interval(5000)
      .pipe(
        switchMap(() => this.messageService.fetchList(this.residentId!, 1, 10))
      )
      .subscribe({
        next: (newMessages) => {
          const uniqueMessages = [
            ...newMessages.reverse(),
            ...this.messages
          ].filter((message, index, self) =>
            index === self.findIndex(m => m.id === message.id)
          );

          this.messages = uniqueMessages;
        },
        error: (err) => {
          console.error('Erro durante o polling de mensagens:', err);
        },
      });
  }

  fetchLastMessages(): void {
    if (!this.residentId || this.currentPage >= 10) {
      return; // Impede a busca se não houver mais páginas
    }

    this.currentPage++; // Avança para a próxima página

    this.messageService.fetchList(this.residentId, this.currentPage, 10).subscribe({
      next: (newMessages) => {
        const uniqueMessages = [
          ...newMessages.reverse(), // Garante a ordem cronológica
          ...this.messages,
        ].filter((message, index, self) =>
          index === self.findIndex((m) => m.id === message.id)
        );

        this.messages = uniqueMessages;
      },
      error: (err) => {
        console.error('Erro ao buscar mensagens:', err);
        this.currentPage--; // Reverte a página em caso de erro
      },
    });
  }

  saveMessage(): void {
    if (this.form.invalid || !this.residentId) {
      return;
    }

    const messageData: MessageDTO = this.form.value;
    this.messageService.create(messageData, this.residentId).subscribe({
      next: (newMessage) => {
        this.form.reset();
        this.loadMessages();
      },
      error: (err) => {
        console.error('Erro ao criar mensagem:', err);
      },
    });
  }

  deleteMessage(messageId: number): void {
    if (this.residentId) {
      this.messageService.delete(messageId, this.residentId).subscribe({
        next: () => {
          this.loadMessages();
        },
        error: (err) => {
          console.error('Erro ao excluir a mensagem:', err);
        },
      });
    }
  }

  resetForm(): void {
    this.form.reset();
    this.isEditing = false;
  }
}
