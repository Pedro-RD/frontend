import {CivilStatus} from './civil-status.enum';
import {Diet} from './diet.enum';
import { Mobility } from './mobility.enum';

export interface ResidentDTO {
  name: string,
  fiscalId: string,
  birthDate: Date,
  specificCare: string,
  mobility: Mobility,
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


