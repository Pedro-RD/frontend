import { Component, OnDestroy } from '@angular/core';
import { FormResidentsComponent } from '../../components/residents/form-residents/form-residents.component';
import { Router, RouterModule } from '@angular/router';
import { concatMap, Subject, Subscription } from 'rxjs';
import { ResidentDTO } from '../../interfaces/resident';
import { ResidentsService } from '../../services/residents/residents.service';




@Component({
  selector: 'app-residents-create',
  standalone: true,
  imports: [
    FormResidentsComponent,
    RouterModule,
  ],
  templateUrl: './residents-create.component.html',
  styleUrl: './residents-create.component.css'
})
export class ResidentsCreateComponent implements OnDestroy {
  residentCreateSub: Subscription | undefined;
  private isSubmitting = false;
  private submitQueue = new Subject<ResidentDTO>();
  private submitSub: Subscription;

  constructor(
    private residentsService: ResidentsService,
    private router: Router,
  ) {
    this.submitSub = this.submitQueue.pipe(
      concatMap(resident =>this.residentsService.create(resident))
    ).subscribe({
      next: () => this.router.navigate(['/residents']),
      error: (err) => console.error(err),
    });
  }

  ngOnDestroy() {
    this.submitQueue.complete();
    this.submitSub.unsubscribe();
  }

  onFormSubmit(resident: ResidentDTO) {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.residentCreateSub = this.residentsService.create(resident).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/residents']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error(err);
      }
    });
  }
}
