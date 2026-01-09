import Job from "../models/job.model";
import {UserRole} from "../utils/constants";

// create job service
export const createJobService = async (req: any) => {
    try {
        const { title, description, category, salary, location } = req.body;

        const newJob = await Job.create({
            title,
            description,
            category,
            salary,
            location,
            user_id: req.user._id
        });

        if (!newJob) {
            return {
                statusCode: 400,
                status: false,
                message: "Job creation failed"
            };
        }
        return {
            statusCode: 201,
            status: true,
            message: "Job posted successfully",
            data: newJob
        };
    } catch (error: any) {
        return { statusCode: 500, status: false, message: error.message };
    }
};

// fetch all jobs service
export const fetchAllJobService = async (req: any) => {
    const role = req.user.role;
    const user_id = req.user._id;
    try {
        let query = {};
        if (role === UserRole.EMPLOYEE) {
            query = { user_id };
        } else if (role === UserRole.JOB_SEEKER || role === UserRole.ADMIN) {
            query = {};
        } else {
            return { statusCode: 403, status: false, message: "Unauthorized role" };
        }

        const jobs = await Job.find(query)
            .populate('user_id', 'first_name last_name email')
            .sort({ createdAt: -1 });

        if (!jobs) {
            return {
                statusCode: 404,
                status: false,
                message: "No jobs post found"
            };
        }

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

// fetch single job
export const fetchJobDetailService = async (req: any) => {

    const role = req.user.role;
    const user_id = req.user._id;
    const {job_id} = req.params;

    try {
        let query: any = { _id: job_id };
        if (role === UserRole.EMPLOYEE) {
            query.user_id = user_id;
        }

        const job = await Job.findOne(query)
            .populate('user_id', 'first_name last_name email')

        if (!job) {
            return {
                statusCode: 404,
                status: false,
                message: "No job found"
            };
        }

        return {
            statusCode: 200,
            status: true,
            data: job
        };
    } catch (error: any) {
        return { statusCode: 500, status: false, message: error.message };
    }
};

// delete job service
export const deleteJobService = async (req: any) => {
    const role = req.user.role;
    const user_id = req.user._id;
    const {job_id} = req.params;

    try {
        let query: any = { _id: job_id };
        if (role === UserRole.EMPLOYEE) {
            query.user_id = user_id;
        }

        const job = await Job.findOneAndDelete(query);

        if (!job) {
            return {
                statusCode: 404,
                status: false,
                message: "Job not found or unauthorized"
            };
        }

        return {
            statusCode: 200,
            status: true,
            message: "Job deleted successfully"
        };
    } catch (error: any) {
        return { statusCode: 500, status: false, message: error.message };
    }
};


// update job service
export const updateJobService = async (req: any) => {
    try {
        const { job_id } = req.params;
        const role = req.user.role;
        const user_id = req.user._id;

        let query: any = { _id: job_id };
        if (role === UserRole.EMPLOYEE) {
            query.user_id = user_id;
        }

        const updatedJob = await Job.findOneAndUpdate(query, req.body, { new: true });

        if (!updatedJob) {
            return { statusCode: 404, status: false, message: "Job not found or unauthorized" };
        }

        return { statusCode: 200, status: true, message: "Job updated" };
    } catch (error: any) {
        return { statusCode: 500, status: false, message: error.message };
    }
};

// search jobs service
export const searchJobsByCategoryService = async (req: any) => {
    try {

        const {category} = req.params;
        const query = { category: { $regex: new RegExp(category, "i") } };

        const jobs = await Job.find(query)
            .populate('user_id', 'first_name last_name email')
            .sort({ createdAt: -1 });

        if (jobs.length === 0) {
            return {
                statusCode: 404,
                status: false,
                message: `No jobs found in the '${category}' category`
            };
        }

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



