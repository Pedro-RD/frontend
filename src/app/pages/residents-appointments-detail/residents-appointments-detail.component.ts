import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Appointment } from '../../interfaces/appointment';
import { Subscription } from 'rxjs';
import { ModalConfirmComponent } from '../../components/forms/modal-confirm/modal-confirm.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ResidentAppointmentsService } from '../../services/residentsAppointments/resident-appointments.service';
import { DatePipe, NgIf } from '@angular/common';
import { LoadingComponent } from '../../components/forms/loading/loading.component';
import { Resident } from '../../interfaces/resident';


@Component({
  selector: 'app-residents-appointments-detail',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    ModalConfirmComponent,
    LoadingComponent,
    NgIf,

  ],
  templateUrl: './residents-appointments-detail.component.html',
  styleUrl: './residents-appointments-detail.component.css'
})
export class ResidentsAppointmentsDetailComponent implements OnInit, OnDestroy {
appointment?: Appointment
  resident?: Resident
  error: string | null = null;
private subs: Subscription[] = [];
@ViewChild(ModalConfirmComponent) deleteModal!: ModalConfirmComponent;

constructor(
  private residentAppointmentsService: ResidentAppointmentsService,
  private route: ActivatedRoute,
  private router: Router

) {}

  ngOnInit() {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  const residentId= Number(this.route.snapshot.paramMap.get('residentId'));
  if(id && residentId) {
    this.subs.push(
      this.residentAppointmentsService.fetchItem(id, residentId).subscribe({
        next: (appointment) => (this.appointment = appointment),
        error: (err) => {
          console.error(err);
          this.error = 'Consulta não encontrada';
      },
      })
    );
  }
}

ngOnDestroy() {
  this.subs.forEach(sub => sub.unsubscribe());
}

  onDelete() {
    const id = Number(this.route.snapshot.paramMap.get('id')); // Obtemos o ID da consulta novamente
    const residentId = Number(this.route.snapshot.paramMap.get('residentId')); // Obtemos o ID do residente

    if (!id || !residentId) {
      console.error('Informações insuficientes para excluir a consulta.');
      this.error = 'Falha ao eliminar consulta';
      return;
    }

    // Chama o serviço delete com id e residentId
    this.subs.push(
      this.residentAppointmentsService.delete(id, residentId).subscribe({
        next: () => {
          this.router.navigate([`/residents/${residentId}/appointments`]); // Redireciona após exclusão
        },
        error: (err) => {
          console.error(err);
          this.error = 'Falha ao eliminar consulta';
        },
      })
    );
  }

showDeleteModal() {
  this.deleteModal.show();
}
}
