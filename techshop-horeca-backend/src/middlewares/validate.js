const { ApiError } = require('./errorHandler');

/**
 * Middleware factory for Zod validation
 * @param {import('zod').AnyZodObject} schema
 */
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (e) {
    // Format Zod errors
    const errors = e.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message
    }));
    
    const error = new ApiError(400, 'Validation Error');
    error.errors = errors;
    next(error);
  }
};

module.exports = validate;
