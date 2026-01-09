import { Response, NextFunction } from 'express';
import { UserRole } from '../utils/constants';
import { AuthRequest } from '../interfaces/auth.interface';

export const authorizeRole = (allowedRoles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    status: false,
                    message: "Unauthorized. User identity not found.",
                });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    status: false,
                    message: "Access denied! You do not have permission for this action.",
                });
            }

            next();
        } catch (err: any) {
            return res.status(500).json({
                status: false,
                message: "Authorization error",
                error: err.message,
            });
        }
    };
};