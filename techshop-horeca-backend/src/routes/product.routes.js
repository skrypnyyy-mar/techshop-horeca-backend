const router = require('express').Router();
const ctrl = require('../controllers/product.controller');
const validate = require('../middlewares/validate-express');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const {
  createProductValidators,
  updateProductValidators,
  listProductValidators,
} = require('../validators/product.validators');

// router.get('/categories', ctrl.getCategories); // Removed for now to fix crash

/**
 * @swagger
 * /products:
 *   get:
 *     summary: List products with filters & pagination
 *     tags: [Products]
 *     parameters:
 *       - { in: query, name: category, schema: { type: string } }
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: minPrice, schema: { type: number } }
 *       - { in: query, name: maxPrice, schema: { type: number } }
 *       - { in: query, name: inStock, schema: { type: boolean } }
 *       - { in: query, name: page, schema: { type: integer } }
 *       - { in: query, name: limit, schema: { type: integer } }
 *     responses:
 *       200: { description: Paginated product list }
 */
router.get('/', listProductValidators, validate, ctrl.list);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Product details }
 *       404: { description: Not found }
 */
router.get('/:id', ctrl.getById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create product [ADMIN]
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201: { description: Product created }
 */
router.post('/', authenticate, authorize('ADMIN'), createProductValidators, validate, ctrl.create);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product [ADMIN]
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Product updated }
 */
router.put('/:id', authenticate, authorize('ADMIN'), updateProductValidators, validate, ctrl.update);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product [ADMIN]
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Product deleted }
 */
router.delete('/:id', authenticate, authorize('ADMIN'), ctrl.remove);

module.exports = router;
