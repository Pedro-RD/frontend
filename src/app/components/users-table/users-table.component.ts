import {Component, OnInit} from '@angular/core';
import {UsersService} from '../../services/users/users.service';
import {User} from '../../interfaces/user';
import {NgForOf} from '@angular/common';
import {UsersTableRowComponent} from '../users-table-row/users-table-row.component';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    NgForOf,
    UsersTableRowComponent
  ],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css'
})
export class UsersTableComponent implements OnInit {

  users: User[] = []; // variável que vai armazenar os utilizadores

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    // Chama o serviço para obter a lista de utilizadores
    this.usersService.getAll().subscribe({
      next: (data: User[]) => this.users = data,
      error: (err) => console.error("Erro ao obter lista de utilizadores", err),
      complete: () => console.log("Pesquisa de utilizadores completa")

    });

    }


}
