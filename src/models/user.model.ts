import mongoose, { Schema, Model } from 'mongoose';
import { UserRole } from '../utils/constants';
import { IUser } from '../interfaces/user.interface';

const userSchema = new Schema<IUser>({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: Object.values(UserRole), 
    default: UserRole.JOB_SEEKER
  }
}, { timestamps: true, versionKey: false });

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;