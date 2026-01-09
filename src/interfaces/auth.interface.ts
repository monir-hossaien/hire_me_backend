import { Request } from 'express';
import { UserRole } from '../utils/constants';


export interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    role: UserRole;
  };
}