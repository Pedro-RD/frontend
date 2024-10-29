import {Component, computed, OnInit, signal} from '@angular/core';
import {UsersTableComponent} from '../../components/old/users-table/users-table.component';
import {SearchBoxComponent} from "../../components/forms/search-box/search-box.component";
import {PaginatorComponent} from '../../components/table/paginator/paginator.component';
import {UsersService} from '../../services/users/users.service';
import {map, Observable, switchMap, tap} from 'rxjs';
import {TableComponent} from '../../components/table/table/table.component';
import {ColumnType, TableConfig} from '../../interfaces/table.interface';
import {User} from '../../interfaces/user';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    UsersTableComponent,
    SearchBoxComponent,
    PaginatorComponent,
    TableComponent,
    AsyncPipe,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  tableConfig: TableConfig<User> = {
    columns: [
      {
        colKey: "name",
        label: "Nome",
        subKey: "role",
        type: ColumnType.PROFILE,
        classList: ["w-40"]
      },
      {
        colKey: "email",
        label: "Email",
        classList: ["w-32"]

      },
      {
        colKey: "phoneNumber",
        label: "Contacto",
        classList: ["w-32"]

      },
      {
        colKey: "address",
        label: "Endereço",
        classList: ["w-64"]
      },
    ]
  }

  private userListSignal = signal<User[]>([]);
  userList = computed(() => this.userListSignal());

  constructor(private usersService: UsersService) {
  }

  get page(): Observable<number> {
    return this.usersService.page$;
  }

  get totalPages(): Observable<number> {
    return this.usersService.totalPages$;
  }

  ngOnInit() {
    let i = 0;
    this.usersService.query$
      .pipe(
        tap((q) => console.log("Query: ", q)),
        switchMap(() => this.usersService.fetchList()),
        map((users) => this.userListSignal.set(users))
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
}
