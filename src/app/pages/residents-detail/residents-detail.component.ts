import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ResidentsService } from '../../services/residents/residents.service';
import { Resident } from '../../interfaces/resident';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ModalConfirmComponent } from '../../components/forms/modal-confirm/modal-confirm.component';
import { LoadingComponent } from '../../components/forms/loading/loading.component';
import { Diet } from '../../interfaces/diet.enum';
import { CivilStatus } from '../../interfaces/civil-status.enum';

@Component({
  selector: 'app-residents-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ModalConfirmComponent, LoadingComponent],
  templateUrl: './residents-detail.component.html',
  styleUrls: ['./residents-detail.component.css']
})
export class ResidentsDetailComponent implements OnInit, OnDestroy {
  resident?: Resident
  error: string | null = null;
  private subs: Subscription[] = [];
  @ViewChild(ModalConfirmComponent) deleteModal!: ModalConfirmComponent;

  constructor(
    private residentsService: ResidentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.subs.push(
        this.residentsService.fetchItem(id).subscribe({
          next: (resident) => (this.resident = resident),
          error: (err) => {
            console.error(err);
            this.error = 'Residente não encontrado';
          },
        })
      );
    }
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  onDelete() {
    if (!this.resident?.id) return;

    this.subs.push(
      this.residentsService.delete(this.resident.id).subscribe({
        next: () => this.router.navigate(['/residents']),
        error: (err) => {
          console.error(err);
          this.error = 'Falha ao eliminar residente';
        },
      })
    );
  }

  showDeleteModal() {
    this.deleteModal.show();
  }
}
