import bcrypt from 'bcrypt';
import User from '../models/user.model';
import {IUser} from "../interfaces/user.interface";
import {generateToken} from "../utils/jwt";
import { Request, Response } from 'express';


// registration service
export const registerService = async (req: any) => {
    try {
        const { first_name, last_name, email, password} = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return {
                statusCode: 400,
                status: false,
                message: "User already exists"
            };
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser: IUser = {
            first_name,
            last_name,
            email,
            password: hashPassword
        };

        const user = await User.create(newUser);

        if (!user) {
            return {
                statusCode: 400,
                status: false,
                message: "User creation failed"
            };
        }

        return {
            statusCode: 201,
            status: true,
            message: "User registered successfully",
        };
    } catch (e: any) {
        return {
            statusCode: 500,
            status: false,
            message: "Something went wrong!",
            error: e.message
        };
    }
};

// login service
export const loginService = async (req: any) => {
    try {
        const {email, password} = req.body ;

        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return {
                statusCode: 404,
                status: false,
                message: "No account created with this email"
            };
        }

        const isPasswordMatch = await bcrypt.compare(password, checkUser.password);
        if (!isPasswordMatch) {
            return {
                statusCode: 401,
                status: false,
                message: "Invalid credentials"
            };
        }

        const token = generateToken(checkUser);

        return {
            statusCode: 200,
            status: true,
            message: "Login successful",
            token: token,
            data: {
                _id: checkUser._id,
                email: checkUser.email,
                role: checkUser.role
            }
        };
    } catch (error: any) {
        return {
            statusCode: 500,
            status: false,
            message: "Something went wrong!",
            error: error.message
        };
    }
};


// logout service
export const logOutService = async (req: Request, res: Response) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        return res.status(200).json({
            status: true,
            message: "Logged out successfully"
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: "Error during logout",
            error: error.message
        });
    }
};