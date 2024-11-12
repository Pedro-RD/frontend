import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormUsersComponent } from '../form-users/form-users.component';
import { UsersService } from '../../services/users/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User, UserDTO } from '../../interfaces/user';
import { LoadingComponent } from "../../components/forms/loading/loading.component";

@Component({
  selector: 'app-users-edit',
  standalone: true,
  imports: [FormUsersComponent, LoadingComponent],
  templateUrl: './users-edit.component.html',
  styleUrl: './users-edit.component.css'
})
export class UsersEditComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  user: User | null = null;
  error: string | null = null;
  isSubmitting = false;

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.subs.push(
        this.usersService.fetchItem(id).subscribe({
          next: (user) => this.user = user,
          error: (err) => {
            console.error(err);
            this.error = 'User not found';
          }
        })
      );
    }
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onFormSubmit(userDto: UserDTO) {
    if (!this.user?.id || this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.error = null;

    // Remove repeatPassword and empty password
    const { repeatPassword, password, ...userData } = userDto;
    const updateData = {
      ...userData,
      ...(password ? { password } : {}),
      id: this.user.id
    };

    this.subs.push(
      this.usersService.update(updateData).subscribe({
        next: () => this.router.navigate(['/users']),
        error: (err) => {
          this.isSubmitting = false;
          this.error = err.error?.message || 'Failed to update user';
        }
      })
    );
  }
}
