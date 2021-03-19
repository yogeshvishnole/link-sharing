import Email from '../utils/email';
import User from '../models/user';
import { signToken as signJwtToken } from '../services/jwt';
import constants from '../constants';
import catchAsync from '../utils/catch-async';

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // check if user already  exists
  if (await User.findOne({ email })) {
    return BusinessError('User with this email already exist!', 400);
  }

  //  create the token
  const token = signJwtToken(
    { name, email, password },
    constants.EMAIL_VERIFICATION_USECASE,
  );

  // send email
  const data = await new Email(email, token).sendEmailVerification();

  // send response
  res.status(200).json({
    status: 'success',
    message: `Email has been sent to ${email},Follow the insttructions to complete your registration`,
  });
});
