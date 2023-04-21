const catchAsync = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((error) => next(error));
  };
};

const globalErrorHandler = (err, req, res, next) => {
  console.error(err);

  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({ message: err.message });
};

class CustomError extends Error {
  constructor(statusCode, message) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = { catchAsync, globalErrorHandler, CustomError };
