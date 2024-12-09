import { Medication } from './medication';

export interface Administration {
  id?: number;
  hour: string | number;
  minute?: string | number;
  dose: number;
  medicament?: Medication;
}
