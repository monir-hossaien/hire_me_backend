import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export const validate = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Show all errors, not just the first one
            stripUnknown: true, // Remove fields not defined in the schema
            errors: {
                wrap: {
                    label: ""
                }
            }
        });

        if (error) {
            const errorMessage = error.details
                .map((detail) => detail.message)

            return res.status(400).json({
                status: false,
                errors: errorMessage
            });
        }

        req.body = value;
        next();
    };
};