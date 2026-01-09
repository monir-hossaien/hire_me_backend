import Joi from 'joi';


export const registerSchema = Joi.object({
    first_name: Joi.string()
        .trim()
        .min(2)
        .max(30)
        .required()
        .messages({
            'string.min': 'First name must be at least 2 characters long',
            'string.max': 'First name cannot exceed 30 characters',
            'any.required': 'First name is required'
        }),

    last_name: Joi.string()
        .trim()
        .min(2)
        .max(30)
        .required()
        .messages({
            'string.min': 'Last name must be at least 2 characters long',
            'string.max': 'Last name cannot exceed 30 characters',
            'any.required': 'Last name is required'
        }),

    email: Joi.string()
        .email()
        .lowercase()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(6)
        .max(100)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.max': 'Password is too long',
            'any.required': 'Password is required'
        }),

    role: Joi.string()
        .valid('ADMIN', 'EMPLOYER', 'JOB_SEEKER')
        .default('JOB_SEEKER')
});


export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});