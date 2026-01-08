import { UserRole } from "../utils/constants";


export interface IUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}