import Application from "../models/application.model";
import Invoice from "../models/invoice.model";
import { fileUpload } from "../utils/file.upload";
import Job from "../models/job.model";
import fs from 'fs';
import mongoose from "mongoose";

const stripe_secret_key = process.env.STRIPE_SECRET_KEY as string;
const stripe = require('stripe')(stripe_secret_key);

// initiate application
export const initiateApplicationService = async (req: any) => {
    try {
        const { job_id } = req.params;
        const user_id = req.user._id;

        const applicationExits = await Application.findOne({ job_id, applicant_id: user_id });
        if (applicationExits) {
            return { statusCode: 400, status: false, message: "You already applied this job" };
        }

        const isExistingCv = await Application.findOne({ applicant_id: user_id }, { cv_url: 1, _id: 0 });

        if (!isExistingCv) {
            if (!req.file) return { statusCode: 400, status: false, message: "CV file is required" };
        }

        const job_info = await Job.findById(job_id);
        if (!job_info) {
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            return { statusCode: 404, status: false, message: "Job not found" };
        }

        let uploadResult;
        if (!isExistingCv) {
            uploadResult = await fileUpload(req.file.path, "hire_me/cvs");
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'bdt',
                    product_data: {
                        name: job_info.title,
                        description: `Application fee for ${job_info.title}`
                    },
                    unit_amount: 10000,
                },
                quantity: 1,
            }],
            mode: 'payment',
            metadata: { job_id, user_id, cv_url: isExistingCv?.cv_url || uploadResult?.secure_url },
            success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
        });

        return { statusCode: 200, status: true, data: { url: session.url } };
    } catch (error: any) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return { statusCode: 500, status: false, message: error.message };
    }
};

// Verify Payment & Create Records
export const verifyPaymentService = async (req: any) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { session_id } = req.query;
        if (!session_id) {
            await session.abortTransaction();
            return { statusCode: 400, status: false, message: "Session ID required" };
        }

        const stripeSession = await stripe.checkout.sessions.retrieve(session_id);
        if (stripeSession.payment_status !== 'paid') {
            await session.abortTransaction();
            return { statusCode: 400, status: false, message: "Payment not verified" };
        }

        const { job_id: mJobId, user_id: mUserId, cv_url } = stripeSession.metadata as any;


        const existingApp = await Application.findOne({ job_id: mJobId, applicant_id: mUserId, is_paid: true });
        if (existingApp) {
            await session.abortTransaction();
            return { statusCode: 200, status: true, data: existingApp };
        }

        const newApplicationId = new mongoose.Types.ObjectId();

        const newInvoice = await Invoice.create([{
            user_id: mUserId,
            application_id: newApplicationId,
            amount: 100,
            transaction_id: stripeSession.id,
            payment_status: 'paid',
            payment_method: "stripe_card"
        }], { session });

        const application = await Application.create([{
            _id: newApplicationId,
            job_id: mJobId,
            applicant_id: mUserId,
            cv_url,
            is_paid: true,
            invoice_id: newInvoice[0]?._id
        }], { session });

        await session.commitTransaction();
        session.endSession();

        return { statusCode: 201, status: true, message: 'Application submitted', data: application[0] };

    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        return { statusCode: 500, status: false, message: error.message };
    }
};

// fetch all applications
export const fetchApplicationsService = async (req: any) => {
    try {
        const { role, _id: user_id } = req.user;
        const { status, job_id, company } = req.query;

        let query: any = {};

        if (role === 'employer') {
            const employerJobs = await Job.find({ employer_id: user_id }).select('_id');
            const jobIds = employerJobs.map(job => job._id);
            query.job_id = { $in: jobIds };
        }

        if (status) query.status = status;
        if (job_id) query.job_id = job_id;

        const applications = await Application.find(query)
            .populate({
                path: 'job_id',
                select: 'title employer_id',
                populate: {
                    path: 'employer_id',
                    select: 'first_name last_name',
                }
            })
            .populate('applicant_id', 'first_name last_name email') // Updated user_id -> applicant_id
            .populate('invoice_id', 'amount payment_status transaction_id');

        let filteredApplications = applications;

        if (company) {
            const searchRegex = new RegExp(company as string, 'i');
            filteredApplications = applications.filter((app: any) => {
                const employer = app.job_id?.employer_id;
                return (
                    searchRegex.test(employer?.first_name) ||
                    searchRegex.test(employer?.last_name)
                );
            });
        }

        return {
            statusCode: 200,
            status: true,
            count: filteredApplications.length,
            data: filteredApplications
        };
    } catch (error: any) {
        return { statusCode: 500, status: false, message: error.message };
    }
};