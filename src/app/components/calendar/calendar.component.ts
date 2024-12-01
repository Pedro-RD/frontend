import { Component, Input, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import ptLocale from '@fullcalendar/core/locales/pt';
import { Shift } from '../../interfaces/shift';
import { EmployeesShiftsService } from '../../services/employeesShifts/employees-shifts.service';
import { Role } from '../../interfaces/roles.enum';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [FullCalendarModule, NgIf],
})
export class CalendarComponent implements OnInit {
  @Input() employeeId!: number; // ID do funcionário
  @Input () userRole!: Role; // Role do utilizador
  @ViewChild('calendar', { static: false }) calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    initialDate: new Date(), // Define o mês atual como padrão
    locales: [ptLocale],
    locale: 'pt',
    headerToolbar: false, // Oculta a barra nativa
    contentHeight: 'auto',
    events: [], // Eventos dinâmicos
    datesSet: this.onDatesSet.bind(this), // Atualiza o calendário ao navegar
    displayEventTime: false, // Oculta horários nos eventos
    editable: true, // Por padrão, não permite edição
    selectable: true, // Permite selecionar um intervalo de dias

  };

  constructor(private shiftService: EmployeesShiftsService) {}

  ngOnInit() {
    if (this.employeeId) {
      const today = new Date(); // Garante que usa a data atual
      console.log('Data Atual no ngOnInit:', today);

      // // Ajusta o comportamento de edição com base na role de utilizador
      // if (this.userRole === Role.Manager) {
      //   this.calendarOptions = {
      //     ...this.calendarOptions,
      //     editable: true, // Torna o calendário editável para managers
      //   };
      //   console.log('Calendário está editável (Manager).');
      // } else {
      //   this.calendarOptions = {
      //     ...this.calendarOptions,
      //     editable: false, // Somente visualização para outros roles
      //   };
      //   console.log('Calendário está apenas para visualização.');
      // }
    }
  }

  navigate(action: 'prev' | 'next' | 'today') {
    if (!this.calendarComponent) {
      console.error('Calendar component não inicializado!');
      return;
    }

    const calendarApi = this.calendarComponent.getApi();

    if (action === 'prev') {
      calendarApi.prev();
    } else if (action === 'next') {
      calendarApi.next();
    } else if (action === 'today') {
      calendarApi.today();
    }

    const currentDate = calendarApi.getDate();
    this.updateMonthAndYear(currentDate);
  }

  onDatesSet(dateInfo: any) {
    const currentDate = new Date(dateInfo.start);
    this.updateMonthAndYear(currentDate);

    const from = this.formatDate(dateInfo.start);
    const to = this.formatDate(dateInfo.end);
    this.loadShifts(from, to);
  }

  private updateMonthAndYear(date: Date) {
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

  }

  get currentMonth(): string {
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ];
    const date = this.calendarComponent?.getApi()?.getDate() || new Date();
    return monthNames[date.getMonth()];
  }

  get currentYear(): number {
    const date = this.calendarComponent?.getApi()?.getDate() || new Date();
    return date.getFullYear();
  }

  private loadShifts(from: string, to: string) {
    console.log('Carregando turnos:', { from, to });

    this.shiftService.fetchList(this.employeeId, from, to).subscribe((shifts) => {
      console.log('Turnos Recebidos:', shifts);

      const events = this.mapShiftsToEvents(shifts);
      this.calendarOptions = { ...this.calendarOptions, events };
    });
  }

  private mapShiftsToEvents(shifts: Shift[]): any[] {
    return shifts.map((shift) => {
      const eventDate = new Date(shift.day);
      const start = new Date(eventDate.setHours(0, 0, 0, 0)); // Define o início como meia-noite
      const end = new Date(eventDate.setHours(23, 59, 59, 999)); // Define o fim como último momento do dia

      const color = this.getShiftColor(shift.shift);  // Cor do turno

      return {
        title: '',  // Título vazio, pois queremos um evento de fundo
        start: start.toISOString(),  // Data de início do turno (meia-noite)
        end: end.toISOString(),      // Data de fim do turno (último momento do dia)
        backgroundColor: color,  // Cor de fundo
        borderColor: color,      // Cor da borda
        textColor: 'transparent',  // Texto invisível
        allDay: true,  // O evento ocupa o dia inteiro
        rendering: 'background'  // Definir como evento de fundo
      };
    });
  }

  private getShiftColor(shiftType: string): string {
    switch (shiftType) {
      case 'Manhã': return '#fc8e8e';
      case 'Tarde': return '#9bb6ff';
      case 'Noite': return '#f6d860';
      case 'Férias': return '#92ffb3';
      case 'Folga': return '#f1f1f1';
      default: return '#000000';
    }
  }

  private getStartOfMonth(date: Date): string {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1)).toISOString().split('T')[0];
  }

  private getEndOfMonth(date: Date): string {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0)).toISOString().split('T')[0];
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}

