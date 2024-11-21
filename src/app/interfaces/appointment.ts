import { AppointmentType } from './appointment-type.enum';
import { AppointmentStatus } from './appointment-status.enum';

export interface AppointmentDTO {
  title: string,
  type: AppointmentType,
  status: AppointmentStatus,
  start: Date,
  observation?: string,

}

export interface Appointment extends AppointmentDTO {
  id: number,
}

