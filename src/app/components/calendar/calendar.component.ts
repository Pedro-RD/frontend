import { Component, Input, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import ptLocale from '@fullcalendar/core/locales/pt';
import { Shift } from '../../interfaces/shift';
import { EmployeesShiftsService } from '../../services/employeesShifts/employees-shifts.service';
import { Role } from '../../interfaces/roles.enum';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { ShiftType } from '../../interfaces/shift-type.enum';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast/toast.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [FullCalendarModule, NgIf, FormsModule, NgForOf, NgClass],
})
export class CalendarComponent implements OnInit {
  @Input() employeeId!: number; // ID do funcionário
  @Input() userRole!: Role; // Role do utilizador
  @ViewChild('calendar', { static: false }) calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    initialDate: new Date(), // Define o mês atual como padrão
    locales: [ptLocale],
    locale: 'pt',
    headerToolbar: { // Corrected to be an object
      left: '',
      center: '',
      right: ''
    },
    contentHeight: 'auto',
    events: [], // Eventos dinâmicos
    datesSet: this.onDatesSet.bind(this), // Atualiza o calendário ao navegar
    displayEventTime: false, // Oculta horários nos eventos
    editable: false, // Por padrão, não permite edição
    selectable: false, // Permite selecionar um intervalo de dias
    dateClick: this.onDateClick.bind(this),
    select: this.onDateSelect.bind(this),
    // Add Tailwind classes to day cells
    dayCellClassNames: (args) => {
      return ['border', 'border-black']; // Apply black border using Tailwind
    },

    // Optional: Add classes to the header cells
    dayHeaderClassNames: (args) => {
      return ['border', 'border-black']; // Apply black border to header cells
    },
  };

  constructor(private employeesShiftsService: EmployeesShiftsService, private authService: AuthService, private toastService: ToastService) {}

  ngOnInit() {
    if (this.employeeId) {
      const today = new Date(); // Garante que usa a data atual
      console.log('Data Atual no ngOnInit:', today);

      this.authService.getUser().subscribe((user) => {
        if(user?.role === Role.Manager) {
          console.log('Role do Utilizador:', this.userRole);
          this.calendarOptions = {
            ...this.calendarOptions,
            dayCellDidMount: (info) => {
              info.el.style.cursor = 'pointer'; // Change the cursor for day cells
            },
            eventDidMount: (info) => {
              info.el.style.cursor = 'default'; // Change the cursor for events
            },
            selectable: true, // Permite selecionar intervalos
            select: this.onDateSelect.bind(this), // Captura a seleção de datas
          };
          console.log('Calendário está editável (Manager).');
        } else {
          this.calendarOptions = {
            ...this.calendarOptions,
            selectable: false, // Não permite selecionar intervalos
            select: undefined, // Remove a função de seleção
          };
          console.log('Calendário está apenas para visualização.');
        }
      });
    }
  }

  navigate(action: 'prev' | 'next' | 'today') {
    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi[action](); // Usa o método do FullCalendar correspondente
      this.updateMonthAndYear(calendarApi.getDate());
    } else {
      console.error('Calendar component não inicializado!');
    }
  }


  onDatesSet(dateInfo: any) {
    const currentDate = new Date(dateInfo.start);
    this.updateMonthAndYear(currentDate);

    const from = this.formatDate(new Date(dateInfo.start.getFullYear(), dateInfo.start.getMonth() -2,0)); // Data de início de -3 meses
    const to = this.formatDate(new Date(dateInfo.end.getFullYear(), dateInfo.end.getMonth() + 2, 0)); // Data de fim de +3 meses
    console.log(`Atualizando eventos para o intervalo: ${from} até ${to}`);
    this.loadShifts(from, to); // Carrega os turnos automaticamente
  }



  private updateMonthAndYear(date: Date) {
    console.log(`Atualizando para ${date.getMonth() + 1}/${date.getFullYear()}`);
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
    this.employeesShiftsService.fetchList(this.employeeId, from, to).subscribe({
      next: (shifts) => {
        console.log('Turnos Recebidos:', shifts);
        const events = this.mapShiftsToEvents(shifts);
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.removeAllEvents();
        events.forEach(event => calendarApi.addEvent(event));
      },
      error: (error) => {
        console.error('Erro ao carregar turnos:', error);
      },
    });
  }

  private mapShiftsToEvents(shifts: Shift[]): any[] {
    return shifts.map((shift) => ({
      title: '',  // Título vazio
      start: shift.day,  // Diretamente do formato retornado
      end: shift.day,  // Para marcar o final do dia
      backgroundColor: this.getShiftColor(shift.shift), // Cor do turno
      allDay: true, // Evento ocupa o dia inteiro
      rendering: 'background', // Define como evento de fundo
      borderColor: 'black', // Borda transparente
    }));
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

  showShiftModal = false; // Controla a visibilidade do modal
  shiftForm = {
    startDate: '', // Data inicial (ou única)
    endDate: '', // Data final (opcional)
    type: ShiftType.Morning as ShiftType, // Tipo de turno
  };

  shiftTypes = [
    { label: 'Manhã', value: ShiftType.Morning },
    { label: 'Tarde', value: ShiftType.Afternoon },
    { label: 'Noite', value: ShiftType.Night },
    { label: 'Férias', value: ShiftType.Vacation },
    { label: 'Folga', value: ShiftType.Break },
  ];

  onDateClick(arg: DateClickArg) {
    const selectedDate = arg.date.toISOString().split('T')[0];
    console.log('Selecionada data única:', selectedDate);

    this.shiftForm.startDate = selectedDate;
    this.shiftForm.endDate = ''; // Sem intervalo
    this.showShiftModal = true; // Exibe o modal
  }

  onDateSelect(arg: DateSelectArg) {
    const startDate = arg.start.toISOString().split('T')[0];
    const endDate = new Date(arg.end);
    endDate.setDate(endDate.getDate() - 1); // Ajusta a data final para não incluir um dia extra
    const formattedEndDate = endDate.toISOString().split('T')[0];

    console.log(`Selecionado intervalo de ${startDate} até ${formattedEndDate}`);

    this.shiftForm.startDate = startDate;
    this.shiftForm.endDate = formattedEndDate;
    this.showShiftModal = true; // Exibe o modal
  }

  openShiftModal(date: string) {
    console.log('Abrindo modal para a data:', date);


    // Verifica se já existe um evento para o dia selecionado
    const existingEvent = this.calendarComponent
      ?.getApi()
      ?.getEvents()
      ?.find(event => event.start?.toISOString().split('T')[0] === date);

    // Se houver um evento existente, assume o tipo do turno dele. Caso contrário, usa o padrão 'Manhã'.
    if (existingEvent) {
      console.log('Turno existente encontrado:', existingEvent);
      this.shiftForm.type = existingEvent.title as ShiftType; // Assume que o título do evento corresponde ao turno
    } else {
      console.log('Nenhum turno existente para o dia selecionado. Padrão: Manhã');
      this.shiftForm.type = ShiftType.Morning; // Padrão é Manhã
    }

    this.showShiftModal = true; // Exibe o modal
  }
  closeShiftModal() {
    console.log('Fechando modal');
    this.showShiftModal = false;
  }

  addShift() {
    const { startDate, endDate, type } = this.shiftForm;

    if (!endDate || startDate === endDate) {
      // Caso de um único turno
      const shiftDTO = {
        day: new Date(startDate),
        shift: type,
      };

      // Verifica se já existe um evento para o dia selecionado
      const calendarApi = this.calendarComponent.getApi();
      const existingEvent = calendarApi.getEvents().some(
        (event) => event.start?.toISOString().split('T')[0] === shiftDTO.day.toISOString().split('T')[0]
      );

      // Envia a requisição de criação/atualização
      this.employeesShiftsService.createOrUpdate(shiftDTO, this.employeeId).subscribe({
        next: (response) => {
          if (existingEvent) {
            this.toastService.success('Turno Atualizado com Sucesso');
          } else {
            this.toastService.success('Turno Criado com Sucesso');
          }

          this.showShiftModal = false; // Fecha o modal
          this.loadShifts(
            this.formatDate(new Date(new Date().getFullYear(), 0, 1)), // Início do ano atual
            this.formatDate(new Date(new Date().getFullYear() + 1, 11, 31)) // Fim do próximo ano
          );
        },
        error: (error) => {
          console.error('Erro ao criar ou atualizar turno:', error);
          this.toastService.error('Erro ao criar ou atualizar turno. Verifique os dados e tente novamente.');
        },
      });
    } else {
      // Caso de múltiplos turnos
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1); // Ajusta a data final para incluir o último dia
      const dates = [];

      for (let date = start; date < end; date.setDate(date.getDate() + 1)) {
        dates.push(new Date(date)); // Clona a data
      }

      const shiftsDTO = dates.map((date) => ({
        day: date,
        shift: type,
      }));

      // Verifica status dos eventos selecionados
      const calendarApi = this.calendarComponent.getApi();
      const datesStatus = dates.map((date) => {
        const formattedDate = date.toISOString().split('T')[0];
        const hasEvent = calendarApi.getEvents().some(
          (event) => event.start?.toISOString().split('T')[0] === formattedDate
        );
        return { date, hasEvent };
      });

      const allNew = datesStatus.every((status) => !status.hasEvent);

      // Envia os turnos ao backend
      this.employeesShiftsService.createOrUpdateBulk(shiftsDTO, this.employeeId).subscribe({
        next: (response) => {
          if (allNew) {
            this.toastService.success('Turno Criado com Sucesso');
          } else {
            this.toastService.success('Turnos Atualizados com Sucesso');
          }

          this.showShiftModal = false; // Fecha o modal
          this.loadShifts(
            this.formatDate(new Date(new Date().getFullYear(), 0, 1)), // Início do ano atual
            this.formatDate(new Date(new Date().getFullYear() + 1, 11, 31)) // Fim do próximo ano
          );
        },
        error: (error) => {
          console.error('Erro ao criar ou atualizar turnos:', error);
          this.toastService.error('Erro ao criar ou atualizar turnos. Verifique os dados e tente novamente.');
        },
      });
    }
  }
}
