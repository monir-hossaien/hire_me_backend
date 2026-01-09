import { Router } from 'express';
import * as jobController from "../controllers/job.controller"
import {authenticateUser} from "../middlewares/auth.middleware";
import {authorizeRole} from "../middlewares/role.middleware";
import {UserRole} from "../utils/constants";
import {validate} from "../middlewares/validation.middleware";
import {jobSchema} from "../validations/job.validation";


const router = Router();

router.post('/create-job',
    authenticateUser,
    authorizeRole([UserRole.EMPLOYEE]),
    validate(jobSchema),
    jobController.createJob
    );

router.get('/all-jobs',
    authenticateUser,
    authorizeRole([UserRole.ADMIN, UserRole.EMPLOYEE]),
    jobController.fetchAllJobs
    );

router.get('/search-jobs/:category', authenticateUser, jobController.searchJobs);

router.get('/fetch-job/:job_id',
    authenticateUser,
    authorizeRole([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.JOB_SEEKER]),
    jobController.fetchJobDetails
    );

router.put('/update-job/:job_id',
    authenticateUser,
    authorizeRole([UserRole.ADMIN, UserRole.EMPLOYEE]),
    jobController.updateJob
    );

router.delete('delete-job/:job_id',
    authenticateUser,
    authorizeRole([UserRole.ADMIN, UserRole.EMPLOYEE]),
    jobController.deleteJob
    );



export default router;