import { Component, OnDestroy } from '@angular/core';
import { concatMap, Subject, Subscription } from 'rxjs';
import { AppointmentDTO } from '../../interfaces/appointment';
import { ResidentAppointmentsService } from '../../services/residentsAppointments/resident-appointments.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormResidentsAppointmentComponent
} from '../../components/form-residents-appointment/form-residents-appointment.component';

@Component({
  selector: 'app-residents-appointments-create',
  standalone: true,
  imports: [
    RouterModule,
    FormResidentsAppointmentComponent,
  ],
  templateUrl: './residents-appointments-create.component.html',
  styleUrl: './residents-appointments-create.component.css'
})
export class ResidentsAppointmentsCreateComponent implements OnDestroy {
  residentAppointmentCreateSub: Subscription | undefined;
  private isSubmitting = false;
  private submitQueue = new Subject<AppointmentDTO>();
  private submitSub: Subscription;

  constructor(
    private residentAppointmentsService: ResidentAppointmentsService,
    private router: Router,
    public route: ActivatedRoute,
  ) {
    this.submitSub = this.submitQueue.pipe(
      concatMap(appointment=> this.residentAppointmentsService.create(appointment, parseInt(this.route.snapshot.paramMap.get("residentId") || "")||0))
    ). subscribe({
      next: () => this.router.navigate(['/residents/',parseInt(this.route.snapshot.paramMap.get("residentId") || "")||0,'/appointments']),
      error: (err) => console.error(err),
    });
  }

  ngOnDestroy() {
    this.submitQueue.complete();
    this.submitSub.unsubscribe();
  }

  onFormSubmit(appointment: AppointmentDTO) {
    if(this.isSubmitting) return;
    this.isSubmitting = true;
    this.residentAppointmentCreateSub = this.residentAppointmentsService.create(appointment,parseInt(this.route.snapshot.paramMap.get("residentId") || "")||0).subscribe({
      next:() => {
        this.isSubmitting = false;
        this.router.navigate(['/residents/'+this.route.snapshot.paramMap.get("residentId")+'/appointments']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error(err);
      }
    })
  }

}

