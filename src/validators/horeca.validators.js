const { body } = require('express-validator');

const HORECA_CATEGORIES = [
  'COFFEE_MACHINES', 'OVENS', 'REFRIGERATION', 'MIXERS',
  'DISHWASHERS', 'STOVES', 'OTHER',
];

const createHorecaValidators = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('tagline').trim().notEmpty().withMessage('Tagline is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('pricePerDay').isFloat({ min: 0 }).withMessage('pricePerDay must be a positive number'),
  body('priceBuy').isFloat({ min: 0 }).withMessage('priceBuy must be a positive number'),
  body('category').isIn(HORECA_CATEGORIES).withMessage(`Category must be one of: ${HORECA_CATEGORIES.join(', ')}`),
  body('imageUrl').isURL().withMessage('imageUrl must be a valid URL'),
  body('power').optional().isString(),
  body('dimensions').optional().isString(),
  body('warranty').optional().isString(),
  body('specs').optional().isArray(),
  body('specs.*.label').optional().notEmpty().withMessage('Spec label required'),
  body('specs.*.value').optional().notEmpty().withMessage('Spec value required'),
];

const updateHorecaValidators = [
  body('name').optional().trim().notEmpty(),
  body('brand').optional().trim().notEmpty(),
  body('tagline').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('pricePerDay').optional().isFloat({ min: 0 }),
  body('priceBuy').optional().isFloat({ min: 0 }),
  body('category').optional().isIn(HORECA_CATEGORIES),
  body('imageUrl').optional().isURL(),
];

module.exports = { createHorecaValidators, updateHorecaValidators };
