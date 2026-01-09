
import express from 'express';
import * as adminController from '../controllers/admin.controller';
import {authenticateUser} from "../middlewares/auth.middleware";
import {authorizeRole} from "../middlewares/role.middleware";
import {UserRole} from "../utils/constants";

const router = express.Router();

router.use(authenticateUser, authorizeRole([UserRole.ADMIN]));

router.get('/users', adminController.fetchAllUsers);
router.patch('/update-user/:user_id', adminController.updateUser);
router.delete('/delete-user/:user_id', adminController.deleteUser);
router.get('/analytics', adminController.fetchCompanyAnalytics);


export default router;