import mongoose, { Schema, Model } from 'mongoose';
import { IJob } from '../interfaces/job.interface';

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    salary: { type: String, required: true },
    location: { type: String, required: true },
    user_id: { 
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true 
    },
  },
  { timestamps: true, versionKey: false }
);

const Job: Model<IJob> = mongoose.model<IJob>('Job', jobSchema);
export default Job;