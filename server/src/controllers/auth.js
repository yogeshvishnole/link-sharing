import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { promisify } from 'util';
import Email from '../utils/email';
import User from '../models/user';
import constants from '../constants';
import catchAsync from '../utils/catch-async';
import BusinessError from '../exceptions/business-error';

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password, categories } = req.body;

  // check if user already  exists
  if (await User.findOne({ email })) {
    return next(new BusinessError('User with this email already exist!', 400));
  }

  const payload = { name, email, password, categories };

  //  create the token
  const token = jwt.sign(payload, process.env.JWT_EMAIL_VERIFICATION, {
    expiresIn: constants.EMAIL_EXPIRATION_TIME,
  });

  // send email
  await new Email(email, token).sendEmailVerification();

  // send response
  return res.status(200).json({
    status: constants.SUCCESS_STATUS,
    message: `Email has been sent to ${email},Follow the instructions to complete your registration`,
  });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const registerActivate = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_EMAIL_VERIFICATION,
  );
  const { name, email, password, categories } = decoded;
  const username = nanoid();
  const user = await User.findOne({ email });
  if (user) {
    return next(new BusinessError('User with this email already exist!', 400));
  }
  await User.create({ name, email, username, password, categories });

  return res.status(201).json({
    status: constants.SUCCESS_STATUS,
    message: 'Registration successful. Please login',
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email })
    .select('+hashed_password')
    .select('+salt');

  if (!user || !user.authenticate(password)) {
    return next(new BusinessError('Incorrect email or password', 400));
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  const { id, username, role, name } = user;

  return res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        id,
        name,
        username,
        email,
        role,
      },
    },
  });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new BusinessError('You are not loggedin , log in to get access', 401),
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new BusinessError(
        'The user belonging to this token does no longer exist',
        401,
      ),
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new BusinessError(
        'User recently changed the password | Please log in  again',
        401,
      ),
    );
  }

  req.user = currentUser;
  next();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new BusinessError(
          'you do not have permission to perform this action',
          403,
        ),
      );
    }
    next();
  });
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new BusinessError('User with the given email does not exist.'));
  }

  const token = jwt.sign({ name: user.name }, process.env.JWT_RESET_PASSWORD, {
    expiresIn: '10m',
  });

  user.resetPasswordLink = token;
  const updatedUser = await user.save();

  if (!updatedUser) {
    return next(new BusinessError('Password reset failed . Try later.'));
  }

  await new Email(email, token).sendResetPassword();

  return res.status(200).json({
    status: 'success',
    message: `Email has been sent to ${email} . Click on the link to reset your password`,
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { resetPasswordLink, newPassword } = req.body;

  await promisify(jwt.verify)(
    resetPasswordLink,
    process.env.JWT_RESET_PASSWORD,
  );

  const user = await User.findOne({ resetPasswordLink });

  user.resetPasswordLink = '';
  user.password = newPassword;

  await user.save();

  return res.status(200).json({
    status: 'success',
    message: 'Great! now you can login with your new password.',
  });
});
