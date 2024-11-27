import { PaymentType } from './payment-type.enum';

export interface PaymentDTO {
amount: number,
date: Date | string,
  month?: number | string,
  year?: number | string,
  type: PaymentType,
  observation?: string

}

export interface Payment extends PaymentDTO {
  id: number,
}

