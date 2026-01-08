import { Document, Types } from 'mongoose';
import { ApplicationStatus } from '../utils/constants';

export interface IApplication extends Document {
  job_id: Types.ObjectId;
  user_id: Types.ObjectId;
  cv_url: string;
  status: ApplicationStatus;
  is_paid: boolean;
  invoice_id?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}