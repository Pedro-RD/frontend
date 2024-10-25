import {Role} from './roles.enum';

export interface User {
  id?: number;
  email: string,
  password: string,
  phoneNumber: string,
  name: string,
  address: string,
  city: string,
  postcode: string,
  fiscalId: string,
  nationality: string,
  role: Role,
}
