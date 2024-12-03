import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessagesService } from '../messages/message.service';
import { Message, MessageDTO } from '../../interfaces/message';
import { ToastService } from '../toast/toast.service';
import { environment } from '../../../environments/environment';

describe('MessagesService', () => {
  let service: MessagesService;
  let httpMock: HttpTestingController;
  let toastService: jasmine.SpyObj<ToastService>;

  const apiUrl = `${environment.apiUrl}residents/`;

  beforeEach(() => {
    const toastSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MessagesService,
        { provide: ToastService, useValue: toastSpy },
      ],
    });

    service = TestBed.inject(MessagesService);
    httpMock = TestBed.inject(HttpTestingController);
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchList', () => {
    it('should fetch a list of messages', () => {
      const residentId = 1;
      const mockResponse = {
        data: [
          { id: 1, content: 'Message 1', createdAt: new Date() },
          { id: 2, content: 'Message 2', createdAt: new Date() },
        ],
        totalPages: 1,
      };

      service.fetchList(residentId).subscribe((messages) => {
        expect(messages.length).toBe(2);
        expect(messages[0].content).toBe('Message 1');
      });

      const req = httpMock.expectOne(`${apiUrl}${residentId}/messages`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle errors when fetching the list', () => {
      const residentId = 1;

      service.fetchList(residentId).subscribe((messages) => {
        expect(messages).toEqual([]);
      });

      const req = httpMock.expectOne(`${apiUrl}${residentId}/messages`);
      expect(req.request.method).toBe('GET');
      req.error(new ErrorEvent('Network error'));

      expect(toastService.error).toHaveBeenCalledWith('Erro ao buscar mensagens');
    });
  });

  describe('fetchItem', () => {
    it('should fetch a specific message', () => {
      const residentId = 1;
      const messageId = 123;
      const mockMessage = { id: messageId, content: 'Sample Message', createdAt: new Date() };

      service.fetchItem(messageId, residentId).subscribe((message) => {
        expect(message.id).toBe(messageId);
        expect(message.content).toBe('Sample Message');
      });

      const req = httpMock.expectOne(`${apiUrl}${residentId}/messages/${messageId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMessage);
    });

    it('should handle errors when fetching a specific message', () => {
      const residentId = 1;
      const messageId = 123;

      service.fetchItem(messageId, residentId).subscribe((message) => {
        expect(message).toEqual({} as Message);
      });

      const req = httpMock.expectOne(`${apiUrl}${residentId}/messages/${messageId}`);
      expect(req.request.method).toBe('GET');
      req.error(new ErrorEvent('Network error'));

      expect(toastService.error).toHaveBeenCalledWith('Erro ao buscar mensagem');
    });
  });

  describe('create', () => {
    it('should create a new message', () => {
      const residentId = 1;
      const newMessage: MessageDTO = { content: 'New Message' };
      const createdMessage: Message = { id: 1, content: 'New Message', createdAt: new Date() };

      service.create(newMessage, residentId).subscribe((message) => {
        expect(message.id).toBe(1);
        expect(message.content).toBe('New Message');
      });

      const req = httpMock.expectOne(`${apiUrl}${residentId}/messages`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newMessage);
      req.flush(createdMessage);

      expect(toastService.success).toHaveBeenCalledWith('Mensagem criada com sucesso');
    });

    it('should handle errors when creating a message', () => {
      const residentId = 1;
      const newMessage: MessageDTO = { content: 'New Message' };

      service.create(newMessage, residentId).subscribe({
        error: (err: any) => {
          expect(err).toBeTruthy();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}${residentId}/messages`);
      expect(req.request.method).toBe('POST');
      req.error(new ErrorEvent('Network error'));

      expect(toastService.error).toHaveBeenCalledWith('Erro ao criar mensagem');
    });
  });

  describe('update', () => {
    it('should update a message', () => {
      const residentId = 1;
      const messageId = 123;
      const updatedMessage: MessageDTO = { content: 'Updated Message' };
      const mockResponse: Message = { id: messageId, content: 'Updated Message', createdAt: new Date() };

      service.update(messageId, updatedMessage, residentId).subscribe((message) => {
        expect(message.id).toBe(messageId);
        expect(message.content).toBe('Updated Message');
      });

      const req = httpMock.expectOne(`${apiUrl}${residentId}/messages/${messageId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updatedMessage);
      req.flush(mockResponse);

      expect(toastService.success).toHaveBeenCalledWith('Mensagem atualizada com sucesso');
    });

    it('should handle errors when updating a message', () => {
      const residentId = 1;
      const messageId = 123;
      const updatedMessage: MessageDTO = { content: 'Updated Message' };

      service.update(messageId, updatedMessage, residentId).subscribe({
        error: (err: any) => {
          expect(err).toBeTruthy();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}${residentId}/messages/${messageId}`);
      expect(req.request.method).toBe('PATCH');
      req.error(new ErrorEvent('Network error'));

      expect(toastService.error).toHaveBeenCalledWith('Erro ao atualizar mensagem');
    });
  });

  describe('delete', () => {
    it('should delete a message', () => {
      const residentId = 1;
      const messageId = 123;

      service.delete(messageId, residentId).subscribe(() => {
        expect(toastService.success).toHaveBeenCalledWith('Mensagem eliminada com sucesso');
      });

      const req = httpMock.expectOne(`${apiUrl}${residentId}/messages/${messageId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle errors when deleting a message', () => {
      const residentId = 1;
      const messageId = 123;

      service.delete(messageId, residentId).subscribe({
        error: (err: any) => {
          expect(err).toBeTruthy();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}${residentId}/messages/${messageId}`);
      expect(req.request.method).toBe('DELETE');
      req.error(new ErrorEvent('Network error'));

      expect(toastService.error).toHaveBeenCalledWith('Erro ao eliminar mensagem');
    });
  });
});
