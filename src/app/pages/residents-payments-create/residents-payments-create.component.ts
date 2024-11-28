import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormResidentsPaymentComponent
} from '../../components/form-residents-payment/form-residents-payment.component';
import { concatMap, Subject, Subscription } from 'rxjs';
import { PaymentDTO } from '../../interfaces/payment';
import { ResidentPaymentsService } from '../../services/residentsPayments/residents-payments.service';
import {
  FormResidentsAppointmentComponent
} from '../../components/form-residents-appointment/form-residents-appointment.component';

@Component({
  selector: 'app-residents-payments-create',
  standalone: true,
  imports: [
    RouterModule,
    FormResidentsPaymentComponent,
    FormResidentsAppointmentComponent,
  ],
  templateUrl: './residents-payments-create.component.html',
  styleUrl: './residents-payments-create.component.css'
})
export class ResidentsPaymentsCreateComponent implements OnDestroy {
  residentPaymentCreateSub: Subscription | undefined;
  private isSubmitting = false;
  private submitQueue = new Subject<PaymentDTO>();
  private submitSub: Subscription;

  constructor(
    private residentPaymentsService: ResidentPaymentsService,
    private router: Router,
    public route: ActivatedRoute,
  ) {
    this.submitSub = this.submitQueue.pipe(
      concatMap(payment=> this.residentPaymentsService.create(payment, parseInt(this.route.snapshot.paramMap.get("residentId") || "")||0))
    ). subscribe({
      next: () => this.router.navigate(['/residents/',parseInt(this.route.snapshot.paramMap.get("residentId") || "")||0,'/payments']),
      error: (err) => console.error(err),
    });
  }

  ngOnDestroy() {
    this.submitQueue.complete();
    this.submitSub.unsubscribe();
  }

  onFormSubmit(payment: PaymentDTO) {
    if(this.isSubmitting) return;
    this.isSubmitting = true;
    this.residentPaymentCreateSub = this.residentPaymentsService.create(payment,parseInt(this.route.snapshot.paramMap.get("residentId") || "")||0).subscribe({
      next:() => {
        this.isSubmitting = false;
        this.router.navigate(['/residents/'+this.route.snapshot.paramMap.get("residentId")+'/payments']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error(err);
      }
    })
  }

}
