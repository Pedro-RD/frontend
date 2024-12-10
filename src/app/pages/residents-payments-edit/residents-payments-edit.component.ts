import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { FormResidentsPaymentComponent } from '../../components/form-residents-payment/form-residents-payment.component';
import { Resident } from '../../interfaces/resident';
import { Payment, PaymentDTO } from '../../interfaces/payment';
import { ActivatedRoute, Router } from '@angular/router';
import { ResidentPaymentsService } from '../../services/residentsPayments/residents-payments.service';

@Component({
  selector: 'app-residents-payments-edit',
  standalone: true,
  imports: [FormResidentsPaymentComponent],
  templateUrl: './residents-payments-edit.component.html',
  styleUrl: './residents-payments-edit.component.css',
})
export class ResidentsPaymentsEditComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  resident: Resident | null = null;
  payment: Payment | null = null;
  error: string | null = null;
  isSubmitting = false;

  constructor(
    private residentPaymentsService: ResidentPaymentsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  ngOnInit() {
    const paymentId = Number(this.route.snapshot.paramMap.get('paymentId'));
    const residentId = Number(this.route.snapshot.paramMap.get('residentId'));
    if (paymentId && residentId) {
      this.subs.push(
        this.residentPaymentsService
          .fetchItem(paymentId, residentId)
          .subscribe({
            next: (payment) => {
              this.payment = payment;
              this.resident = { id: residentId } as Resident; // Ensure resident is set
            },
            error: (err) => {
              console.error(err);
              this.error = 'Pagamento não encontrado';
            },
          }),
      );
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  onFormSubmit(paymentDTO: PaymentDTO) {
    if (!this.payment?.id || !this.resident?.id || this.isSubmitting) return;

    this.isSubmitting = true;
    this.error = null;

    this.subs.push(
      this.residentPaymentsService
        .update(this.payment.id, paymentDTO, this.resident.id)
        .subscribe({
          next: () =>
            this.router.navigate([`/residents/${this.resident?.id}/payments`]),
          error: (err) => {
            this.isSubmitting = false;
            this.error = err.error?.message || 'Failed to update resident';
          },
        }),
    );
  }
}
