const { body, query } = require('express-validator');

const CATEGORIES = ['PHONES', 'LAPTOPS', 'AUDIO', 'WEARABLES', 'TABLETS', 'ACCESSORIES'];

const createProductValidators = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('tagline').trim().notEmpty().withMessage('Tagline is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isIn(CATEGORIES).withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  body('imageUrl').isURL().withMessage('imageUrl must be a valid URL'),
  body('colors').isArray({ min: 1 }).withMessage('Colors must be a non-empty array'),
  body('brand').optional().isString(),
  body('stockCount').optional().isInt({ min: 0 }).withMessage('stockCount must be a non-negative integer'),
];

const updateProductValidators = [
  body('name').optional().trim().notEmpty(),
  body('tagline').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').optional().isIn(CATEGORIES).withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  body('imageUrl').optional().isURL(),
  body('colors').optional().isArray({ min: 1 }),
  body('stockCount').optional().isInt({ min: 0 }),
];

const listProductValidators = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('category').optional().isIn(CATEGORIES),
];

module.exports = { createProductValidators, updateProductValidators, listProductValidators };
