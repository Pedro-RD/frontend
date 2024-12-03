import { Component, OnInit, OnDestroy } from '@angular/core';
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
  styleUrls: [],
})
export class MessageComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  form: FormGroup;
  residentId: number | null = null;
  isEditing: boolean = false;
  loggedUserId: number | null = null;
  private pollingSubscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService, // Serviço de autenticação
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(255)]],
    });
  }

  ngOnInit(): void {
    const idFromRoute = this.route.snapshot.params['residentId'];
    if (idFromRoute) {
      this.residentId = +idFromRoute;
    }

    // Obtém o ID do usuário logado via AuthService
    this.authService
      .getUser()
      .pipe(take(1)) // Obtém o valor atual apenas uma vez
      .subscribe((user) => {
        this.loggedUserId = user?.id || null;
      });

    if (this.residentId) {
      this.loadMessages();
      this.startPolling();
    }
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  loadMessages(): void {
    if (this.residentId) {
      this.messageService.fetchList(this.residentId).subscribe({
        next: (response) => {
          // Inverte a ordem das mensagens
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
        switchMap(() => this.messageService.fetchList(this.residentId!))
      )
      .subscribe({
        next: (newMessages) => {
          // Inverte a ordem das novas mensagens
          if (JSON.stringify(newMessages) !== JSON.stringify(this.messages)) {
            this.messages = newMessages.reverse();
          }
        },
        error: (err) => {
          console.error('Erro durante o polling de mensagens:', err);
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
          // Após excluir, recarrega a lista de mensagens
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
