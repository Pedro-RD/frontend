import {Role} from './roles.enum';

export interface User {
  email: string,
  password: string,
  phoneNumber: number,
  name: string,
  address: string,
  city: string,
  postcode: string,
  fiscalId: string,
  nationality: string,
  role: Role,
}
