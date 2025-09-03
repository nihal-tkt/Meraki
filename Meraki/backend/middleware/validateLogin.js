import { body } from 'express-validator';

export const validateLogin = [
    body('email')
        .isEmail().withMessage('Please enter a valid email address'),
    body('password')
        .notEmpty().withMessage('Password is required')
];
