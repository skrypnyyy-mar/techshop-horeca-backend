const { sendError } = require('../utils/response.utils');

/**
 * Middleware factory: allow only specific roles.
 * Usage: authorize('ADMIN') or authorize('ADMIN', 'HORECA_MANAGER')
 *
 * Must be used AFTER authenticate middleware.
 *
 * @param {...string} roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Not authenticated', 401);
    }
    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Required role: ${roles.join(' or ')}`,
        403
      );
    }
    next();
  };
};

module.exports = authorize;
