import { Administration } from './administration';
import { Resident } from './resident';

export interface MedicationDTO {
  name: string;
  instructions: string;
  // resident: number;
  quantity: number;
  prescriptionQuantity: number;
  dueDate: Date;
  medicamentAdministrations?: Administration[];
}

export interface Medication extends MedicationDTO {
  id: number;
  resident?: Resident;
}
