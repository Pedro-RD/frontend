import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shift-modal',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './shift-modal.component.html',
  styleUrl: './shift-modal.component.css'
})
export class ShiftModalComponent {
  @Input() showModal: boolean = false; // Controla a visibilidade do modal
  @Input() selectedDate: string | null = null; // A data selecionada
  @Output() closeModalEvent = new EventEmitter<void>(); // Emite evento para fechar o modal
  @Output() shiftAssigned = new EventEmitter<{ date: string, shift: string }>(); // Emite evento quando um turno é atribuído

  selectedShift: string | null = null; // Armazena o turno selecionado

  // Método para fechar o modal
  closeModal() {
    this.closeModalEvent.emit(); // Emitir evento para fechar o modal
  }

  // Método para atribuir o turno
  assignShift() {
    if (this.selectedShift && this.selectedDate) {
      this.shiftAssigned.emit({ date: this.selectedDate, shift: this.selectedShift });
      this.closeModal(); // Fecha o modal após atribuir o turno
    }
  }
}
