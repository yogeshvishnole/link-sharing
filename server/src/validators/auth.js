import { check } from 'express-validator';

export const userRegisterValidator = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const userLoginValidator = [
  check('email')
    .not()
    .isEmpty()
    .withMessage('Please provide email and password'),
  check('password')
    .not()
    .isEmpty()
    .withMessage('Please provide email and password'),
];

export const forgotPasswordValidator = [
  check('email').isEmail().withMessage('Must be a valid email address.'),
];

export const resetPasswordValidator = [
  check('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least  6 characters long.'),
  check('resetPasswordLink').not().isEmpty().withMessage('Token is required'),
];

export const userUpdateValidator = [
  check('name').not().isEmpty().withMessage('Name is required'),
];
