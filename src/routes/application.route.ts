import express from 'express';
import * as applicationController from '../controllers/application.controller';
import {authenticateUser} from "../middlewares/auth.middleware";
import {authorizeRole} from "../middlewares/role.middleware";
import {UserRole} from "../utils/constants";
import {upload} from "../utils/file.upload";

const router = express.Router();

router.post('/create-checkout-session/:job_id',
    authenticateUser,
    authorizeRole([UserRole.JOB_SEEKER]),
    upload.single('cv_url'),
    applicationController.initiateJobApply
)


router.get('/verify-payment',
    authenticateUser,
    authorizeRole([UserRole.JOB_SEEKER]),
    applicationController.verifyJobApply
);


router.get('/all-applications',
    authenticateUser,
    applicationController.fetchAllApplications
);

router.patch('/update-status/:application_id',
    authenticateUser,
    authorizeRole([UserRole.ADMIN, UserRole.EMPLOYER]),
    applicationController.updateApplicationStatus
);




export default router;