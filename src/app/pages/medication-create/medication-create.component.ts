import { Component } from '@angular/core';
import {FormResidentsComponent} from "../../components/residents/form-residents/form-residents.component";

@Component({
  selector: 'app-medication-create',
  standalone: true,
    imports: [
        FormResidentsComponent
    ],
  templateUrl: './medication-create.component.html',
  styleUrl: './medication-create.component.css'
})
export class MedicationCreateComponent {

}
