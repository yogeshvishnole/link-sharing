import { check } from 'express-validator';

export const categoryCreateValidator = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('image').not().isEmpty().withMessage('Image is required'),
  check('content')
    .isLength({ min: 20 })
    .withMessage('Content must be at least 20 characters long.'),
];

export const categoryUpdateValidator = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('content')
    .isLength({ min: 20 })
    .withMessage('Content must be at least 20 characters long.'),
];
