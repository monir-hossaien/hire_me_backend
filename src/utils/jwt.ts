import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IUser } from '../interfaces/user.interface';

dotenv.config();

export const generateToken = (user: IUser): string => {
  const payload = { 
    _id: user._id, 
    email: user.email, 
    role: user.role 
  };


  const secret = process.env.JWT_SECRET_KEY as string;


  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRATION_TIME_ACCESS_TOKEN as any) || '1d'
  };

  return jwt.sign(payload, secret, options);
};



export const verifyToken = (token: string) => {
    try {
        const secret = process.env.JWT_SECRET_KEY as string;
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (err) {
        throw err;
    }
}