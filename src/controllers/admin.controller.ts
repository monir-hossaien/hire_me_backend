import { Request, Response } from 'express';
import * as adminServices from "../services/admin.services";


// Fetch all users with optional role filtering
export const fetchAllUsers = async (req: Request, res: Response) => {
    const result = await adminServices.fetchAllUserService(req);
    return res.status(result.statusCode).json(result);
};


// Admin update user details or roles
export const updateUser = async (req: Request, res: Response) => {
    const result = await adminServices.updateUserService(req);
    return res.status(result.statusCode).json(result);
};

// Admin delete a user account
export const deleteUser = async (req: Request, res: Response) => {
    const result = await adminServices.deleteUserService(req);
    return res.status(result.statusCode).json(result);
};

// Fetch company-wide analytics (Revenue, User counts, Job stats)
export const fetchCompanyAnalytics = async (req: Request, res: Response) => {
    const result = await adminServices.fetchCompanyAnalyticsService(req);
    return res.status(result.statusCode).json(result);
};