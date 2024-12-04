import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users/users.service';
import { User, UserRxpDTO } from '../../interfaces/user';
import { map, Subscription, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ModalConfirmComponent } from '../../components/forms/modal-confirm/modal-confirm.component';
import { LoadingComponent } from "../../components/forms/loading/loading.component";
import { Role } from '../../interfaces/roles.enum';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-users-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ModalConfirmComponent, LoadingComponent],
  templateUrl: './users-detail.component.html',
  styleUrl: './users-detail.component.css'
})
export class UsersDetailComponent implements OnInit, OnDestroy {
  user: UserRxpDTO | null = null;
  error: string | null = null;
  private subs: Subscription[] = [];
  @ViewChild(ModalConfirmComponent) deleteModal!: ModalConfirmComponent;
  employeeId: number | null = null;

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.subs.push(
        this.usersService.fetchItem(id).pipe(
          tap(console.log)
        ).subscribe({
          next: (user) => this.user = user,
          error: (err) => {
            console.error(err);
            this.error = 'User not found';
          }
        })
      );
    }

    return this.authService.getUser().pipe(
      tap((user) => console.log('User: ', user)),
      map((user: User | null) => user?.employeeId?.id)
    ).subscribe((id) => {
      if (id) {
        this.employeeId = id;
      }
    })
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onDelete() {
    if (!this.user?.id) return;

    this.subs.push(
      this.usersService.delete(this.user.id).subscribe({
        next: () => this.router.navigate(['/users']),
        error: (err) => {
          console.error(err);
          this.error = 'Failed to delete user';
        }
      })
    );
  }

  showDeleteModal() {
    this.deleteModal.show();
  }

  protected readonly Role = Role;
}
