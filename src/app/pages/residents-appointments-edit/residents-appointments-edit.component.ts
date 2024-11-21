import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingComponent } from '../../components/forms/loading/loading.component';
import {
  FormResidentsAppointmentComponent
} from '../../components/form-residents-appointment/form-residents-appointment.component';
import { Subscription } from 'rxjs';
import { Resident } from '../../interfaces/resident';
import { Appointment, AppointmentDTO } from '../../interfaces/appointment';
import { ActivatedRoute, Router } from '@angular/router';
import {ResidentAppointmentsService} from '../../services/residentsAppointments/resident-appointments.service';

@Component({
  selector: 'app-residents-appointments-edit',
  standalone: true,
  imports: [
    LoadingComponent,
    FormResidentsAppointmentComponent,
  ],
  templateUrl: './residents-appointments-edit.component.html',
  styleUrl: './residents-appointments-edit.component.css'
})
export class ResidentsAppointmentsEditComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  resident: Resident | null = null;
  appointment: Appointment | null = null;
  error: string | null = null;
  isSubmitting = false;

  constructor(
    private residentAppointmentsService: ResidentAppointmentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    const appointmentId = Number(this.route.snapshot.paramMap.get('appointmentId'));
    const residentId = Number(this.route.snapshot.paramMap.get('residentId'));
    if (appointmentId && residentId) {
      this.subs.push(
        this.residentAppointmentsService.fetchItem(appointmentId, residentId).subscribe({
          next: (appointment) => {
            this.appointment = appointment;
            this.resident = { id: residentId } as Resident; // Ensure resident is set
          },
          error: (err) => {
            console.error(err);
            this.error = 'Consulta não encontrada';
          },
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onFormSubmit(appointmentDTO: AppointmentDTO) {
    if (!this.appointment?.id || !this.resident?.id || this.isSubmitting) return;

    this.isSubmitting = true;
    this.error = null;

    this.subs.push(
      this.residentAppointmentsService.update(
        this.appointment.id, appointmentDTO, this.resident.id
      ).subscribe({
        next: () => this.router.navigate([`/residents/${this.resident?.id}/appointments`]),
        error: (err) => {
          this.isSubmitting = false;
          this.error = err.error?.message || 'Failed to update resident';
        }
      })
    );
  }

}
