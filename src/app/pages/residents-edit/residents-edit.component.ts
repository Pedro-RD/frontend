import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingComponent } from '../../components/forms/loading/loading.component';
import { FormResidentsComponent } from '../../components/residents/form-residents/form-residents.component';
import { Subscription } from 'rxjs';
import { ResidentsService } from '../../services/residents/residents.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Resident, ResidentDTO } from '../../interfaces/resident';
import { UserDTO } from '../../interfaces/user';

@Component({
  selector: 'app-residents-edit',
  standalone: true,
  imports: [
    FormResidentsComponent,
    LoadingComponent,
  ],
  templateUrl: './residents-edit.component.html',
  styleUrl: './residents-edit.component.css'
})
export class ResidentsEditComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  resident: Resident | null = null;
  error: string | null = null;
  isSubmitting = false;

  constructor(
    private residentsService: ResidentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.subs.push(
        this.residentsService.fetchItem(id).subscribe({
          next: (resident) => (this.resident = resident),
          error: (err) => {
            console.error(err);
            this.error = 'Residente não encontrado';
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onFormSubmit(residentDTO: ResidentDTO) {
    if (!this.resident?.id || this.isSubmitting) return;

    this.isSubmitting = true;
    this.error = null;





    this.subs.push(
      this.residentsService.update({id:this.resident.id ,...residentDTO }).subscribe({
        next: () => this.router.navigate(['/residents']),
        error: (err) => {
          this.isSubmitting = false;
          this.error = err.error?.message || 'Failed to update resident';
        }
      })
    );
  }
}
