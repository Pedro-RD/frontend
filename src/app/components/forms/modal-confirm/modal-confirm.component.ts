import { Component, ElementRef, ViewChild, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-confirm.component.html',
  styleUrl: './modal-confirm.component.css'
})
export class ModalConfirmComponent {
  title = input('title', { alias: 'title' });
  message = input.required();
  confirmLabel = input('Confirmar', { alias: 'confirmLabel' });
  cancelLabel = input('Cancelar', { alias: 'cancelLabel' });
  confirmClass = input('confirmClass', { alias: 'confirmClass' });
  confirm = output<void>();
  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;

  show() {
    this.modal.nativeElement.showModal();
  }

  close() {
    this.modal.nativeElement.close();
  }

  onConfirm() {
    this.confirm.emit();
    this.close();
  }
}
