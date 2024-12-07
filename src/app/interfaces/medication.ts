import { Resident } from './resident';

export interface MedicationDTO {
  name: string;
  instructions: string;
  // resident: number;
  quantity: number;
  prescriptionQuantity: number;
  dueDate: Date;
}

export interface Medication extends MedicationDTO {
  id: number;
  resident?: Resident;
}
