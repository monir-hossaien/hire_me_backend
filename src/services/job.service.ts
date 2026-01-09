import Job from "../models/job.model";
import { UserRole } from "../utils/constants";

// 1. Create job service
export const createJobService = async (req: any) => {
    try {
        const { title, description, category, salary, location } = req.body;

        const newJob = await Job.create({
            title,
            description,
            category,
            salary,
            location,
            employer_id: req.user._id
        });

        if (!newJob) {
            return { statusCode: 400, status: false, message: "Job creation failed" };
        }
        return { statusCode: 201, status: true, message: "Job posted successfully", data: newJob };
    } catch (error: any) {
        return { statusCode: 500, status: false, message: error.message };
    }
};

// 2. Fetch all jobs service
export const fetchAllJobService = async (req: any) => {
    const { role, _id: user_id } = req.user;
    try {
        let query: any = {};

        // If Employer, only show their own jobs. Admin and Job Seeker see all.
        if (role === UserRole.EMPLOYER) {
            query.employer_id = user_id;
        }

        const jobs = await Job.find(query)
            .populate('employer_id', 'first_name last_name email') // Correct field name
            .sort({ createdAt: -1 });

        return {
            statusCode: 200,
            status: true,
            count: jobs.length,
            data: jobs
        };
    } catch (error: any) {
        return { statusCode: 500, status: false, message: error.message };
    }
};

// 3. Fetch single job
export const fetchJobDetailService = async (req: any) => {
    const { role, _id: user_id } = req.user;
    const { job_id } = req.params;

    try {
        let query: any = { _id: job_id };

        // Ensure Employer can only view details of their own job
        if (role === UserRole.EMPLOYER) {
            query.employer_id = user_id;
        }

        const job = await Job.findOne(query)
            .populate('employer_id', 'first_name last_name email');

        if (!job) {
            return { statusCode: 404, status: false, message: "No job found" };
        }

        return { statusCode: 200, status: true, data: job };
    } catch (error: any) {
        return { statusCode: 500, status: false, message: error.message };
    }
};

// 4. Delete job service
export const deleteJobService = async (req: any) => {
    const { role, _id: user_id } = req.user;
    const { job_id } = req.params;

    try {
        let query: any = { _id: job_id };
        if (role === UserRole.EMPLOYER) {
            query.employer_id = user_id;
        }

        const job = await Job.findOneAndDelete(query);

        if (!job) {
            return { statusCode: 404, status: false, message: "Job not found or unauthorized" };
        }

        return { statusCode: 200, status: true, message: "Job deleted successfully" };
    } catch (error: any) {
        return { statusCode: 500, status: false, message: error.message };
    }
};

// 5. Update job service
export const updateJobService = async (req: any) => {
    try {
        const { job_id } = req.params;
        const { role, _id: user_id } = req.user;

        let query: any = { _id: job_id };
        if (role === UserRole.EMPLOYER) {
            query.employer_id = user_id;
        }

        const updatedJob = await Job.findOneAndUpdate(query, req.body, { new: true });

        if (!updatedJob) {
            return { statusCode: 404, status: false, message: "Job not found or unauthorized" };
        }

        return { statusCode: 200, status: true, message: "Job updated", data: updatedJob };
    } catch (error: any) {
        return { statusCode: 500, status: false, message: error.message };
    }
};

// 6. Search jobs service
export const searchJobsByCategoryService = async (req: any) => {
    try {
        const { role, _id: user_id } = req.user;
        const { category } = req.params;

        let query: any = {
            category: { $regex: new RegExp(category, "i") }
        };

        if (role === UserRole.EMPLOYER) {
            query.employer_id = user_id;
        }

        const jobs = await Job.find(query)
            .populate('employer_id', 'first_name last_name email')
            .sort({ createdAt: -1 });

        return {
            statusCode: 200,
            status: true,
            count: jobs.length,
            data: jobs
        };
    } catch (error: any) {
        return { statusCode: 500, status: false, message: error.message };
    }
};