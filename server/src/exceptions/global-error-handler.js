import BusinessError from './business-error';
import constants from '../constants';

const handleUnverifiedEmailError = () => {
  const message = `We could not verify your email. Please try again`;
  const err = new BusinessError(400, message);
  return err;
};

const handleJWTExpirationError = () =>
  new BusinessError('Your token has expired ! please try again ', 401);

const handleJWTError = () =>
  new BusinessError('Invalid token, please log in again', 401);

const sendErrorDev = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  console.log('Error ', err);
  return res.status(500).json({
    status: constants.UNKNOWN_ERROR_STATUS,
    message: 'Something went very wrong',
  });
};

export default (err, req, res, next) => {
  console.log(err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || constants.UNKNOWN_ERROR_STATUS;
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.code === 'MessageRejected') {
      error = handleUnverifiedEmailError();
    }
    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpirationError();
    }

    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    sendErrorProd(error, req, res);
  }
};
