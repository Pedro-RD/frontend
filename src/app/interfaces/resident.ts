import {CivilStatus} from './civil-status.enum';
import {Diet} from './diet.enum';

export interface ResidentDTO {
  name: string,
  fiscalId: string,
  birthDate: Date,
  specificCare: string,
  civilStatus: CivilStatus,
  nationality: string,
  diet: Diet,
  dietRestrictions: string,
  allergies: string,
  bedNumber: number,
  relatives: number[];
}

export interface Resident extends ResidentDTO {
  id: number,

}


