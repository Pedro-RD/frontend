import {Role} from './roles.enum';
import { Employee, EmployeeDTO, UserEmployee } from './employee';

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
  employeeId?: {id: number},
}

export interface User extends UserDTO {
  id: number,
}

export interface UserRxpDTO extends User {
  // employee: null | UserEmployee;
  employee: null | Employee;
  // relatives: Relative
}

// export interface UserUpDTO extends User {
//   employee: null | Employee;
//   // relatives: Relative
// }
