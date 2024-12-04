import { ShiftType } from './shift-type.enum';

export interface ShiftDTO {
  shift: ShiftType,
  day: Date,
  id?: number



}
export interface Shift extends ShiftDTO {
  shifts: Shift [];

}
