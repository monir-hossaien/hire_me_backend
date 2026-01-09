import Joi from 'joi';

export const jobSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(5)
        .max(100)
        .required()
        .messages({
            'string.min': 'Job title should be at least 5 characters',
            'any.required': 'Job title is required'
        }),

    description: Joi.string()
        .min(20)
        .required()
        .messages({
            'string.min': 'Description is too short. Provide more details.',
            'any.required': 'Description is required'
        }),

    category: Joi.string()
        .required()
        .messages({
            'any.required': 'Please select a job category'
        }),

    salary: Joi.string()
        .required()
        .messages({
            'any.required': 'Salary information is required'
        }),

    location: Joi.string()
        .trim()
        .required()
        .messages({
            'any.required': 'Job location is required'
        }),
    user_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .messages({
            'string.pattern.base': 'Invalid User ID format'
        })
});