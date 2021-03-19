import { validationResult } from 'express-validator';
import constants from '../constants';

export const runValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      status: constants.KNOWN_ERROR_STATUS,
    });
  }
  next();
};
