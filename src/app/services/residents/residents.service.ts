import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Resident} from '../../interfaces/resident';

@Injectable({
  providedIn: 'root'
})
export class ResidentsService {

  constructor() { }

  getAll(): Observable<Resident[]> {

    return of([{
      id: 1,
      name: "Juan",
      fiscalId: "123456789",
      birthDate: new Date ("1990-01-01T00:00:00.000Z"),
      specificCare: "none",
      civilStatus: "single", //enum
      nationality: "spanish",
      diet: "normal", //enum
      dietRestrictions: "none",
      allergies: "none",
      bedNumber: 1,
    }
    ,{
        id: 1,
        name: "Juan",
        fiscalId: "123456789",
        birthDate: new Date ("1990-01-01T00:00:00.000Z"),
        specificCare: "none",
        civilStatus: "single", //enum
        nationality: "spanish",
        diet: "normal", //enum
        dietRestrictions: "none",
        allergies: "none",
        bedNumber: 1,
      }
      ,{
        id: 1,
        name: "Juan",
        fiscalId: "123456789",
        birthDate: new Date ("1990-01-01T00:00:00.000Z"),
        specificCare: "none",
        civilStatus: "single", //enum
        nationality: "spanish",
        diet: "normal", //enum
        dietRestrictions: "none",
        allergies: "none",
        bedNumber: 1,
      }
      ])
  }

}
