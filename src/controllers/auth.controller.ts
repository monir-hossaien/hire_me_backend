import * as authServices from "../services/auth.service";
import { Request, Response } from 'express';
import dotenv from "dotenv";
dotenv.config();

// registration
export const register = async (req: Request, res: Response) => {
    const result = await authServices.registerService(req)
    return res.status(result.statusCode).json(result)
}


// login
export const login = async (req: Request, res: Response) => {
    const result = await authServices.loginService(req)
    if (result.status && result.token) {
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
        });
    }
    return res.status(result.statusCode).json(result)
}


// logout
export const logOut = async (req: Request, res: Response) => {
    const result = await authServices.logOutService(req, res)
    return res.status(result.statusCode).json(result)
}