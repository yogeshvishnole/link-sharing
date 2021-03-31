import constants from '../constants';

class BusinessError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4')
      ? constants.KNOWN_ERROR_STATUS
      : constants.UNKNOWN_ERROR_STATUS;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default BusinessError;
