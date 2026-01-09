import {Request, Response} from "express";
import * as applicationServices from "../services/application.service";



export const initiateJobApply = async (req: Request, res: Response) => {
    const result = await applicationServices.initiateApplicationService(req)
    return res.status(result.statusCode).json(result)
}

export const verifyJobApply = async (req: Request, res: Response) => {
    const result = await applicationServices.verifyPaymentService(req)
    return res.status(result.statusCode).json(result)
}


// update application status
export const updateApplicationStatus = async (req: Request, res: Response) => {
    const result = await applicationServices.updateApplicationStatusService(req)
    return res.status(result.statusCode).json(result)
}


// fetch all applications
export const fetchAllApplications = async (req: Request, res: Response) => {
    const result = await applicationServices.fetchApplicationsService(req)
    return res.status(result.statusCode).json(result)
}

