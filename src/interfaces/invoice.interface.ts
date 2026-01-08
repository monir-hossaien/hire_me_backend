import { Document, Types } from 'mongoose';
import { PaymentStatus } from '../utils/constants';

export interface IInvoice extends Document {
  user_id: Types.ObjectId;
  application_id: Types.ObjectId;
  amount: number;
  currency: string;
  payment_status: PaymentStatus;
  transaction_id?: string;
  payment_method?: string;
  createdAt: Date;
  updatedAt: Date;
}