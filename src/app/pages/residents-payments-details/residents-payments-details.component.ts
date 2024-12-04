import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ModalConfirmComponent } from '../../components/forms/modal-confirm/modal-confirm.component';
import { LoadingComponent } from '../../components/forms/loading/loading.component';
import { Payment } from '../../interfaces/payment';
import { Resident } from '../../interfaces/resident';
import { Subscription } from 'rxjs';
import { ResidentPaymentsService } from '../../services/residentsPayments/residents-payments.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-residents-payments-details',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    ModalConfirmComponent,
    LoadingComponent,
    NgIf,
  ],
  templateUrl: './residents-payments-details.component.html',
  styleUrl: './residents-payments-details.component.css'
})
export class ResidentsPaymentsDetailsComponent implements OnInit, OnDestroy{
  payment?: Payment
  resident?: Resident
  error: string | null = null;
  private subs: Subscription[] = [];
  @ViewChild(ModalConfirmComponent) deleteModal!: ModalConfirmComponent;

  constructor(
  private residentPaymentsService: ResidentPaymentsService,
  private route: ActivatedRoute,
  private router: Router,
  private location: Location
  ) {}


  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const residentId = Number(this.route.snapshot.paramMap.get('residentId'));
    if (id && residentId) {
      this.subs.push(
        this.residentPaymentsService.fetchItem(id, residentId).subscribe({
          next: (payment) => {
            this.payment = payment;
            this.resident = { id: residentId } as Resident; // Ensure resident is set
          },
          error: (err) => {
            console.error(err);
            this.error = 'Pagamento não encontrado';
          },
        })
      );
    }
  }
  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
}

  onDelete() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const residentId = Number(this.route.snapshot.paramMap.get('residentId'));

    if(!id || !residentId) {
      console.error('Informações insuficientes para apagar o pagamento');
      this.error = 'Falha ao eliminar o pagamento';
      return;
    }

    this.subs.push(
      this.residentPaymentsService.delete(id, residentId).subscribe({
        next: () => {
          this.router.navigate(['/residents', residentId, 'payments']);
        },
        error: (err) => {
          console.error(err);
          this.error = 'Falha ao eliminar o pagamento';
        }
      })
    );
}
showDeleteModal() {
  this.deleteModal.show();
}

  goBack() {
    this.location.back();

  }
}
