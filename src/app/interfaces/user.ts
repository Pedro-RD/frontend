import {Role} from './roles.enum';

export interface UserDTO {
  email: string,
  password?: string,
  repeatPassword?: string,
  phoneNumber: string,
  name: string,
  address: string,
  city: string,
  postcode: string,
  fiscalId: string,
  nationality: string,
  role: Role,
  employee?: {id: number},
}

export interface User extends UserDTO {
  id: number,
}
