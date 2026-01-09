import User from "../models/user.model";
import Job from "../models/job.model";
import Application from "../models/application.model";
import Invoice from "../models/invoice.model";
import { UserRole } from "../utils/constants";
import mongoose from "mongoose";

// Fetch all users
export const fetchAllUserService = async (req: any) => {
    try {
        const { role } = req.query;

        let query: any = { role: { $ne: UserRole.ADMIN } };

        if (role) {
            query = { role };
        }

        const users = await User.find(query)
            .select("-password")
            .sort({ createdAt: -1 });

        return {
            statusCode: 200,
            status: true,
            count: users.length,
            data: users
        };
    } catch (error: any) {
        return { statusCode: 500, status: false, message: error.message };
    }
};

// Update User
export const updateUserService = async (req: any) => {
    try {
        const { user_id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(user_id, req.body, { new: true }).select("-password");

        if (!updatedUser) return { statusCode: 404, status: false, message: "User not found" };

        return { statusCode: 200, status: true, message: "User updated", data: updatedUser };
    } catch (error: any) {
        return { statusCode: 500, status: false, message: error.message };
    }
};

// Delete User
export const deleteUserService = async (req: any) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { user_id } = req.params;

        const userToDelete = await User.findById(user_id);
        if (!userToDelete) {
            await session.abortTransaction();
            return { statusCode: 404, status: false, message: "User not found" };
        }

        if (userToDelete.role === UserRole.ADMIN) {
            await session.abortTransaction();
            return { statusCode: 403, status: false, message: "Cannot delete Admin accounts" };
        }

        // If Employer: Delete their Jobs and all Applications to those jobs
        if (userToDelete.role === UserRole.EMPLOYER) {
            const employerJobs = await Job.find({ employer_id: user_id });
            const jobIds = employerJobs.map(job => job._id);

            // Delete applications for those jobs
            await Application.deleteMany({ job_id: { $in: jobIds } }, { session });
            // Delete the jobs themselves
            await Job.deleteMany({ employer_id: user_id }, { session });
        }

        // If Job Seeker: Delete their Applications and related Invoices
        if (userToDelete.role === UserRole.JOB_SEEKER) {
            await Application.deleteMany({ applicant_id: user_id }, { session });
            await Invoice.deleteMany({ user_id: user_id }, { session });
        }

        // Finally, delete the User
        await User.findByIdAndDelete(user_id, { session });

        await session.commitTransaction();
        session.endSession();

        return {
            statusCode: 200,
            status: true,
            message: "User and all related data deleted successfully"
        };

    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        return { statusCode: 500, status: false, message: error.message };
    }
};

// Company Analytics
export const fetchCompanyAnalyticsService = async (req: any) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalEmployers = await User.countDocuments({ role: UserRole.EMPLOYER });
        const totalJobSeekers = await User.countDocuments({ role: UserRole.JOB_SEEKER });

        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();

        // Calculate Revenue from paid invoices
        const revenueData = await Invoice.aggregate([
            { $match: { payment_status: 'paid' } },
            { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        // Recent 5 applications for dashboard preview
        const recentApplications = await Application.find()
            .populate('applicant_id', 'first_name last_name')
            .populate('job_id', 'title')
            .limit(5)
            .sort({ createdAt: -1 });

        return {
            statusCode: 200,
            status: true,
            data: {
                counts: {
                    totalUsers,
                    totalEmployers,
                    totalJobSeekers,
                    totalJobs,
                    totalApplications
                },
                revenue: {
                    totalAmount: totalRevenue,
                    currency: "BDT"
                },
                recentApplications
            }
        };
    } catch (error: any) {
        return { statusCode: 500, status: false, message: error.message };
    }
};