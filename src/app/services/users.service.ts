import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {User} from '../interfaces/user';
import {Role} from '../interfaces/roles.enum';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor() { }

  getAll(): Observable<User[]> {

    return of([{
      email: "test@email.com",
      password: "test12345",
      phoneNumber: 999999999,
      name: "Mary",
      address: "Far away",
      city: "Old Town",
      postcode: '4455-900',
      fiscalId: "890909098",
      nationality: "China",
      role: Role.Admin
    }
    ,{
        email: "test@email.com",
        password: "test12345",
        phoneNumber: 999999999,
        name: "Mary",
        address: "Far away",
        city: "Old Town",
        postcode: '4455-900',
        fiscalId: "890909098",
        nationality: "China",
        role: Role.Caretaker
      }
    ,{
        email: "test@email.com",
        password: "test12345",
        phoneNumber: 999999999,
        name: "Mary",
        address: "Far away",
        city: "Old Town",
        postcode: '4455-900',
        fiscalId: "890909098",
        nationality: "China",
        role: Role.Manager
      }
    ])
  }

}
