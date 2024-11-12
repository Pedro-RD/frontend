import { Component, OnDestroy } from '@angular/core';
import { FormUsersComponent } from '../form-users/form-users.component';
import { UsersService } from '../../services/users/users.service';
import { UserDTO } from '../../interfaces/user';
import { Router, RouterModule } from '@angular/router';
import { Subscription, Subject, concatMap } from 'rxjs';

@Component({
  selector: 'app-users-create',
  standalone: true,
  imports: [FormUsersComponent, RouterModule],
  templateUrl: './users-create.component.html',
  styleUrl: './users-create.component.css',
})
export class UsersCreateComponent implements OnDestroy {
  userCreateSub: Subscription | undefined;
  private isSubmitting = false;
  private submitQueue = new Subject<UserDTO>();
  private submitSub: Subscription;

  constructor(
    private usersService: UsersService,
    private router: Router,
  ) {
    // Handle submissions sequentially
    this.submitSub = this.submitQueue.pipe(
      concatMap(user => this.usersService.create(user))
    ).subscribe({
      next: () => this.router.navigate(['/users']),
      error: (err) => console.error(err),
    });
  }

  ngOnDestroy(): void {
    this.submitQueue.complete();
    this.submitSub.unsubscribe();
  }

  onFormSubmit(user: UserDTO) {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.userCreateSub = this.usersService.create(user).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error(err);
      }
    });
  }
}
