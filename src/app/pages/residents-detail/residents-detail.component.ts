import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResidentsService } from '../../services/residents/residents.service';
import { Resident } from '../../interfaces/resident';
import { DatePipe, NgIf } from '@angular/common';
import { CivilStatus } from '../../interfaces/civil-status.enum';
import { Diet } from '../../interfaces/diet.enum';

@Component({
  selector: 'app-residents-detail',
  templateUrl: './residents-detail.component.html',
  styleUrls: ['./residents-detail.component.css'],
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
  ],
})
export class ResidentsDetailComponent implements OnInit {
  resident: Resident = {
    id: 0, // valor provisório
    name: '',
    fiscalId: '',
    birthDate: new Date(),
    specificCare: '',
    civilStatus: CivilStatus.Single,  // Valor padrão do enum
    nationality: '',
    diet: Diet.Pescatarian,  // Valor padrão do enum
    dietRestrictions: '',
    allergies: '',
    bedNumber: 0,
    relatives: [], // Array vazio como padrão
  };
  error: string | null = null;


  constructor(
    private residentsService: ResidentsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id']; // Correctly accessing the route parameter 'id'
    this.residentsService.fetchItem(id).subscribe({
      next: (resident) => (this.resident = resident),
      error: () => (this.error = 'Failed to fetch resident'),
    });
  }
}
