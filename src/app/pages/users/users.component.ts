import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { SearchBoxComponent } from '../../components/forms/search-box/search-box.component';
import { PaginatorComponent } from '../../components/table/paginator/paginator.component';
import { UsersService } from '../../services/users/users.service';
import {
  Observable,
  map,
  switchMap,
  tap,
  Subscription,
  combineLatest,
  combineLatestWith,
} from 'rxjs';
import { TableComponent } from '../../components/table/table/table.component';
import { ColumnType, TableConfig } from '../../interfaces/table.interface';
import { User } from '../../interfaces/user';
import { AsyncPipe } from '@angular/common';
import { Order } from '../../interfaces/paged-response.interface';
import { SelectLimitComponent } from '../../components/table/select-limit/select-limit.component';
import { Router, RouterLink } from '@angular/router';
import { Role, RolePt } from '../../interfaces/roles.enum';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BackButtonComponent } from '../../components/table/back-button/back-button.component';
import {
  BackButtonDashboardComponent
} from '../../components/table/back-button-dashboard/back-button-dashboard.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    SearchBoxComponent,
    PaginatorComponent,
    TableComponent,
    AsyncPipe,
    SelectLimitComponent,
    RouterLink,
    ReactiveFormsModule,
    BackButtonComponent,
    BackButtonDashboardComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit, OnDestroy {
  roleControl = new FormControl<Role | string>('');
  tableConfig: TableConfig<User> = {
    columns: [
      {
        colKey: 'name',
        label: 'Nome',
        type: ColumnType.PROFILE,
        classList: ['w-40'],
        imageKey: 'profilePicture',
      },
      {
        colKey: 'email',
        label: 'Email',
        classList: ['w-32'],
      },
      {
        colKey: 'phoneNumber',
        label: 'Contacto',
        classList: ['w-32'],
      },
      {
        colKey: 'role',
        label: 'Função',
        classList: ['w-32'],
      },
    ],
  };

  private userListSignal = signal<User[]>([]);
  userList = computed(() => this.userListSignal());

  private subscription?: Subscription;

  constructor(private usersService: UsersService, private router: Router) {}

  ngOnDestroy(): void {
    this.usersService.clearAll();
    this.subscription?.unsubscribe();
  }

  get page(): Observable<number> {
    return this.usersService.page$;
  }

  get totalPages(): Observable<number> {
    return this.usersService.totalPages$;
  }

  get orderBy(): Observable<string> {
    return this.usersService.orderBy$;
  }

  get orderDirection(): Observable<Order> {
    return this.usersService.order$;
  }

  get limit(): Observable<number> {
    return this.usersService.limit$;
  }

  ngOnInit() {
    this.roleControl.valueChanges.subscribe((role) => {
      if (role !== null) {
        this.handleRoleChange(role);
      }
    });

    this.usersService.query$
      .pipe(
        combineLatestWith(this.usersService.role$),
        switchMap(() => this.usersService.fetchList()),
        map((users) =>
          users.map((u) => ({ ...u, role: this.translateRole(u.role) })),
        ),
        map((users) => this.userListSignal.set(users)),
      )
      .subscribe();
  }

  handleSearch(searchTerm: string): void {
    this.usersService.setSearch(searchTerm);
  }

  handleNextPage() {
    this.usersService.nextPage();
  }

  handlePreviousPage() {
    this.usersService.prevPage();
  }

  handleHeaderClick(key: string) {
    this.usersService.setOrderBy(key);
  }

  handleRowCliked(key: number) {
    this.router.navigate(['/users/detail', key]);
  }

  handleLimitChange(limit: number) {
    this.usersService.setPageSize(limit);
  }

  translateRole(role: Role | RolePt): RolePt {
    switch (role) {
      case Role.Manager:
        return RolePt.Manager;
      case Role.Caretaker:
        return RolePt.Cuidador;
      case Role.Relative:
        return RolePt.Familiar;
      default:
        return RolePt.Desconhecido;
    }
  }
  protected readonly Order = Order;

  get Role() {
    return Role;
  }

  handleRoleChange = (role: Role | string) => {
    this.usersService.changeRole(role);
  };
}
