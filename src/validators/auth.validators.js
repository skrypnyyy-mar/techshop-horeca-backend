const { body } = require('express-validator');

const registerValidators = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 }),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Invalid phone number'),
];

const loginValidators = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const refreshValidators = [
  body('refreshToken').notEmpty().withMessage('refreshToken is required'),
];

module.exports = { registerValidators, loginValidators, refreshValidators };
