const { body } = require('express-validator');

const createBookingValidators = [
  body('horecaItemId').isUUID().withMessage('Valid horecaItemId (UUID) required'),
  body('bookingType')
    .isIn(['RENT', 'BUY'])
    .withMessage('bookingType must be RENT or BUY'),
  body('startDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('startDate must be a valid ISO date'),
  body('endDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('endDate must be a valid ISO date'),
  body('contactName').trim().notEmpty().withMessage('contactName is required'),
  body('contactPhone')
    .isMobilePhone()
    .withMessage('Valid contactPhone required'),
  body('notes').optional().isString().isLength({ max: 500 }),
];

const updateBookingStatusValidators = [
  body('status')
    .isIn(['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED'])
    .withMessage('Invalid booking status'),
];

module.exports = { createBookingValidators, updateBookingStatusValidators };
