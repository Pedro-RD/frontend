import { Component, OnInit, signal } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeesShiftsService } from '../../services/employeesShifts/employees-shifts.service';
import { Shift } from '../../interfaces/shift';
import { map, switchMap, tap } from 'rxjs';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-employees-shifts',
  standalone: true,
  imports: [
    CalendarComponent,
    NgIf,

  ],
  templateUrl: './employees-shifts.component.html',
  styleUrl: './employees-shifts.component.css'
})
export class EmployeesShiftsComponent implements OnInit {
  employeeId: number = 0; // ID do funcionário (pode ser dinâmico)
  shiftsListSignal = signal<Shift[]>([]); // Sinal para armazenar os turnos carregados

  constructor(private employeesShiftsService: EmployeesShiftsService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    // Obter employeeId da rota e carregar turnos com from/to
    this.activatedRoute.paramMap
      .pipe(
        map((params) => parseInt(params.get('id') || '0', 10)), // Extrai o ID da rota
        tap((id) => (this.employeeId = id)),
        switchMap((id) =>
          this.employeesShiftsService.fetchList(
            id,
            this.getStartOfMonth(), // Data inicial
            this.getEndOfMonth() // Data final
          )
        ),
        tap((shifts) => console.log('Turnos carregados:', shifts)) // Log para depuração
      )
      .subscribe((shifts) => {
        this.shiftsListSignal.set(shifts); // Atualiza o sinal com os turnos carregados
      });
  }

  private getStartOfMonth(): string {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  }

  private getEndOfMonth(): string {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  }

}
