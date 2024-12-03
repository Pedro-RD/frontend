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
            editable: true, // Torna o calendário editável para managers
            selectable: true, // Permite selecionar intervalos
            select: this.onDateSelect.bind(this), // Captura a seleção de datas
          };
          console.log('Calendário está editável (Manager).');
        } else {
          this.calendarOptions = {
            ...this.calendarOptions,
            editable: false, // Somente visualização para outros roles
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

    const from = this.formatDate(dateInfo.start); // Data de início do mês
    const to = this.formatDate(dateInfo.end); // Data de fim do mês
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
      borderColor: 'transparent', // Borda transparente
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
    date: '',
    type: ShiftType.Morning as ShiftType, // Defina como ShiftType para suportar qualquer valor do enum
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
    this.openShiftModal(selectedDate);
  }

  onDateSelect(arg: DateSelectArg) {
    const selectedDate = arg.start.toISOString().split('T')[0];
    this.openShiftModal(selectedDate);
  }

  openShiftModal(date: string) {
    console.log('Abrindo modal para a data:', date);
    this.shiftForm.date = date;

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
    const { date, type } = this.shiftForm;

    // Criar o turno no formato esperado
    const shiftDTO = {
      day: new Date(date), // Mantém 'day' como Date
      shift: type, // Tipo do turno
    };

    console.log('Enviando shiftDTO:', shiftDTO);

    // Verificar se o turno já existe localmente
    const existingShift = this.calendarComponent
      ?.getApi()
      ?.getEvents()
      ?.some(event => event.start?.toISOString().split('T')[0] === shiftDTO.day.toISOString().split('T')[0]);

    // Enviar o turno ao backend
    this.employeesShiftsService.createOrUpdate(shiftDTO, this.employeeId).subscribe({
      next: (response) => {
        if (existingShift) {
          console.log('Turno atualizado com sucesso:', response);
          this.toastService.success('Turno atualizado com sucesso');
        } else {
          console.log('Turno criado com sucesso:', response);
          this.toastService.success('Turno criado com sucesso');
        }

        this.showShiftModal = false; // Fecha o modal em caso de sucesso
        this.loadShifts(
          this.getStartOfMonth(new Date()),
          this.getEndOfMonth(new Date())
        ); // Atualiza o calendário
      },
      error: (error) => {
        console.error('Erro ao criar turno:', error);
        this.toastService.error('Erro ao criar turno. Verifique os dados e tente novamente.');
      },
    });
  }
}
