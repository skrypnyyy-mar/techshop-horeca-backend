const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response.utils');

/**
 * Run after express-validator chains.
 * If errors found → 422 with details, else → next().
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(
      res,
      'Validation error',
      422,
      errors.array().map((e) => ({ field: e.path, message: e.msg }))
    );
  }
  next();
};

module.exports = validate;
