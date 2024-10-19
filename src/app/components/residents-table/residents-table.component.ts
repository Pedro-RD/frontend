import {Component, OnInit} from '@angular/core';
import {Resident} from '../../interfaces/resident';
import {ResidentsService} from '../../services/residents/residents.service';
import {NgForOf} from '@angular/common';
import {ResidentsTableRowComponent} from '../residents-table-row/residents-table-row.component';

@Component({
  selector: 'app-residents-table',
  standalone: true,
  imports: [
    NgForOf,
    ResidentsTableRowComponent
  ],
  templateUrl: './residents-table.component.html',
  styleUrl: './residents-table.component.css'
})
export class ResidentsTableComponent implements OnInit{

  residents: Resident[] = []; // variável que vai armazenar os residentes

  constructor(private residentsService: ResidentsService) {}

  ngOnInit():void {
    // chama o serviço para obter a lista de residentes
    this.residentsService.getAll().subscribe({
      next: (data: Resident[]) => this.residents = data,
      error: (err) => console.log("Erro ao obter lista de residentes completa", err),
      complete: () => console.log("Pesquisa de residentes completa")
    });
  }

}
