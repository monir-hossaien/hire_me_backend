import mongoose, { Schema, Model } from 'mongoose';
import { IApplication } from '../interfaces/application.interface';
import { ApplicationStatus } from '../utils/constants';

const applicationSchema = new Schema<IApplication>(
  {
    job_id: { 
      type: Schema.Types.ObjectId, 
      ref: 'Job', 
      required: true 
    },
    user_id: { 
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true 
    },
    cv_url: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      enum: Object.values(ApplicationStatus), 
      default: ApplicationStatus.PENDING 
    },
    is_paid: { 
      type: Boolean, 
      default: false
    },
    invoice_id: { 
      type: Schema.Types.ObjectId, 
      ref: 'Invoice',
      required: true 
    },
  },
  { timestamps: true, versionKey: false }
);

// High-performance index to quickly find a user's applications
applicationSchema.index({ user_id: 1, job_id: 1 });

const Application: Model<IApplication> = mongoose.model<IApplication>('Application', applicationSchema);
export default Application;