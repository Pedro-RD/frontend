import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-export-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './export-modal.component.html',
  styleUrl: './export-modal.component.css'
})
export class ExportModalComponent {
  @Output() confirm = new EventEmitter<{ mes: string; ano: number }>();
  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;

  meses = [
    { value: '1', label: 'Janeiro' },
    { value: '2', label: 'Fevereiro' },
    { value: '3', label: 'Março' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Maio' },
    { value: '6', label: 'Junho' },
    { value: '7', label: 'Julho' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ];

  selectedMes: string = '';
  selectedAno: number | null = null;

  show() {
    this.modal.nativeElement.showModal();
  }

  close() {
    this.modal.nativeElement.close();
  }

  onConfirm() {
    if (this.selectedMes && this.selectedAno) {
      this.confirm.emit({ mes: this.selectedMes, ano: this.selectedAno });
      this.close();
    }
  }
}
