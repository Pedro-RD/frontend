import { AppointmentType } from './appointment-type.enum';
import { AppointmentStatus } from './appointment-status.enum';

export interface AppointmentDTO {
  title: string,
  appointmentType: AppointmentType,
  appointmentStatus: AppointmentStatus,
  startDate: Date,
  observation?: string,
  residentId: number,

}

export interface Appointment extends AppointmentDTO {
  id: number,
}

