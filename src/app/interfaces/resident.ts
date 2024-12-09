import { CivilStatus } from './civil-status.enum';
import { Diet } from './diet.enum';
import { Mobility } from './mobility.enum';
import { User } from './user';

export interface ResidentDTO {
  name: string;
  fiscalId: string;
  birthDate: Date;
  specificCare: string;
  mobility: Mobility;
  civilStatus: CivilStatus;
  nationality: string;
  diet: Diet;
  dietRestrictions: string;
  allergies: string;
  bedNumber: number;
  relatives: number[] | User[];
  profilePicture?: string;
}

export interface Resident extends ResidentDTO {
  id: number;
}
