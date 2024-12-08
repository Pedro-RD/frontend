import { AppointmentType } from './appointment-type.enum';
import { AppointmentStatus } from './appointment-status.enum';
import { Resident } from './resident';

export interface AppointmentDTO {
  title: string;
  type: AppointmentType;
  status: AppointmentStatus;
  start: Date;
  observation?: string;
  resident?: Resident;
}

export interface Appointment extends AppointmentDTO {
  id: number;
}
