const logger = require('../utils/logger');

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error
  logger.error({
    msg: message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
  });

  res.status(statusCode).json({
    status: err.status || 'error',
    message: message,
    // Add validation errors if they exist (from Zod)
    errors: err.errors || undefined,
  });
};

module.exports = {
  ApiError,
  errorHandler,
};
