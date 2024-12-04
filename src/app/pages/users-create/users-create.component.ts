import { Component, OnDestroy } from '@angular/core';
import { FormUsersComponent } from '../form-users/form-users.component';
import { UsersService } from '../../services/users/users.service';
import { UserDTO } from '../../interfaces/user';
import { Router, RouterModule } from '@angular/router';
import { combineLatest, combineLatestWith, concatMap, iif, mergeMap, of, Subject, Subscription, take } from 'rxjs';
import { Role } from '../../interfaces/roles.enum';
import { EmployeeService } from '../../services/employees/employee.service';
import { UserEmployee } from '../../interfaces/employee';

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
    private employeeService: EmployeeService,
    private router: Router,
  ) {
    // Handle submissions sequentially
    this.submitSub = this.submitQueue.pipe(
      concatMap(user => this.usersService.create(user)),
    ).subscribe({
      next: (user) => {
          this.router.navigate(['/users']);
      },
      error: (err) => console.error(err),
    });
  }

  ngOnDestroy(): void {
    this.submitQueue.complete();
    this.submitSub.unsubscribe();
  }

  onFormSubmit(userDTO: UserEmployee) {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.userCreateSub = this.usersService.create(userDTO).pipe(
      // emite apenas uma vez
      take(1),
      // merge entre os observables
      mergeMap((user) => {
        return iif(
          () => user.role !== Role.Relative,
          this.employeeService.create({
            salary: userDTO.salary!,
            contractStart: userDTO.contractStart!,
            contractEnds: userDTO.contractEnds!,
            userId: user.id,
        }),
          //of() == observable vazio
          of(user)
        );
      })
    ).subscribe({
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
