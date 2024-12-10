import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormUsersComponent } from '../form-users/form-users.component';
import { UsersService } from '../../services/users/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { iif, mergeMap, of, Subscription, take } from 'rxjs';
import { UserRxpDTO } from '../../interfaces/user';
import { Role } from '../../interfaces/roles.enum';
import { Employee, UserEmployee } from '../../interfaces/employee';
import { EmployeeService } from '../../services/employees/employee.service';

@Component({
  selector: 'app-users-edit',
  standalone: true,
  imports: [FormUsersComponent],
  templateUrl: './users-edit.component.html',
  styleUrl: './users-edit.component.css',
})
export class UsersEditComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  user: UserRxpDTO | null = null;
  employee: Employee | null = null;
  error: string | null = null;
  isSubmitting = false;

  constructor(
    private usersService: UsersService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.subs.push(
        this.usersService.fetchItem(id).subscribe({
          next: (user) => (this.user = user),
          error: (err) => {
            console.error(err);
            this.error = 'User not found';
          },
        }),
      );
    }
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  onFormSubmit(userDto: UserEmployee) {
    if (!this.user?.id || this.isSubmitting) return;

    this.isSubmitting = true;
    this.error = null;

    // Remove repeatPassword and empty password
    const { repeatPassword, password, ...userData } = userDto;
    const updateData = {
      ...userData,
      ...(password ? { password } : {}),
      id: this.user.id,
    };

    this.subs.push(
      this.usersService
        .update(updateData)
        .pipe(
          // emite apenas uma vez
          take(1),
          // merge entre os observables
          mergeMap((user) => {
            const employee = this.user?.employee;

            return iif(
              //verifica se  user é employee
              () => user.role !== Role.Relative,
              this.employeeService.update({
                id: employee!.id,
                salary: userDto.salary!,
                contractStart: userDto.contractStart!,
                contractEnds: userDto.contractEnds!,
                // user id não pode ser alterado
                // userId: this.user.id!,
              }),
              //of() == observable vazio
              of(user),
            );
          }),
        )
        .subscribe({
          next: () => this.router.navigate(['/users']),
          error: (err) => {
            this.isSubmitting = false;
            this.error = err.error?.message || 'Failed to update user';
          },
        }),
    );
  }
}
