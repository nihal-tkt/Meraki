import { body } from 'express-validator';

export const validateRegister = [
    body('fullName')
        .notEmpty().withMessage('Full name is required'),
    body('email')
        .isEmail().withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[\W_]/).withMessage('Password must contain at least one special character'),
    body('role')
        .isIn(['student', 'instructor']).withMessage('Role must be either "student" or "instructor"')
];
