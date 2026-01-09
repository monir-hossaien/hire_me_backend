import { Request, Response } from 'express';
import * as jobServices from "../services/job.service"

// create job
export const createJob = async (req: Request, res: Response) => {
    const result = await jobServices.createJobService(req)
    return res.status(result.statusCode).json(result)
}


// fetch all job
export const fetchAllJobs = async (req: Request, res: Response) => {
    const result = await jobServices.fetchAllJobService(req)
    return res.status(result.statusCode).json(result)
}


// fetch single job
export const fetchJobDetails = async (req: Request, res: Response) => {
    const result = await jobServices.fetchJobDetailService(req)
    return res.status(result.statusCode).json(result)
}


// delete single job
export const deleteJob = async (req: Request, res: Response) => {
    const result = await jobServices.deleteJobService(req)
    return res.status(result.statusCode).json(result)
}


// update single job
export const updateJob = async (req: Request, res: Response) => {
    const result = await jobServices.deleteJobService(req)
    return res.status(result.statusCode).json(result)
}

// search jobs
export const searchJobs = async (req: Request, res: Response) => {
    const { category } = req.params;
    const result = await jobServices.searchJobsByCategoryService(req);
    return res.status(result.statusCode).json(result);
};