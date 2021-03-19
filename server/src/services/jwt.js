import jwt from 'jsonwebtoken';
import constants from '../constants';

// here open closed principle can be used
export const signToken = (payload, useCase) => {
  if (useCase === constants.EMAIL_VERIFICATION_USECASE) {
    return jwt.sign(payload, process.env.JWT_EMAIL_VERIFICATION, {
      expiresIn: constants.EMAIL_EXPIRATION_TIME,
    });
  }
};
