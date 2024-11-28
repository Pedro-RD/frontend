import { UserDTO } from './user';

export interface EmployeeDTO {
  salary: number,
  contractStart: Date,
  contractEnds: Date,
  userId: number,
}

export interface Employee extends EmployeeDTO {
  id: number;
}

export interface UserEmployee extends UserDTO {
  salary?: number,
  contractStart?: Date,
  contractEnds?: Date,
}
