import { PaymentType } from './payment-type.enum';

export interface PaymentDTO {
amount: number,
date: Date | string,
  month: number| string| null,
  year: number | string| null,
  type: PaymentType,
  observation?: string

}

export interface Payment extends PaymentDTO {
  id: number,
}

