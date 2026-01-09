import { Router } from 'express';
const router = Router();

import * as authController from '../controllers/auth.controller';
import {validate} from "../middlewares/validation.middleware";
import {loginSchema, registerSchema} from "../validations/auth.validation";

router.post('/auth/register', validate(registerSchema), authController.register);
router.post('/auth/login', validate(loginSchema), authController.login);
router.get('/auth/logout', authController.logOut);


export default router;