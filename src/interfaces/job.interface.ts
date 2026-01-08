

import { Document, Types } from 'mongoose';

export interface IJob extends Document {
  title: string;
  description: string;
  category: string;
  salary: string;
  location: string;
  user_id: Types.ObjectId; // Link to the User (Employer)
  createdAt: Date;
  updatedAt: Date;
}