export interface Medication {
  id: number;
  name: string;
  instructions: string;
  resident: number;
  quantity: number;
  prescriptionQuantity: number;
  dueDate: Date;
}
