const router = require('express').Router();
const ctrl = require('../controllers/order.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
  createOrderValidators,
  updateOrderStatusValidators,
} = require('../validators/order.validators');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order [AUTH]
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [deliveryAddress, items]
 *             properties:
 *               deliveryAddress: { type: string }
 *               notes: { type: string }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId: { type: string }
 *                     quantity:  { type: integer }
 *     responses:
 *       201: { description: Order created }
 */
router.post('/', authenticate, createOrderValidators, validate, ctrl.create);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: List orders (own for CLIENT; all for ADMIN)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: query, name: status, schema: { type: string } }
 *       - { in: query, name: page, schema: { type: integer } }
 *       - { in: query, name: limit, schema: { type: integer } }
 *     responses:
 *       200: { description: Paginated orders }
 */
router.get('/', authenticate, ctrl.list);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order details [AUTH]
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Order details }
 *       404: { description: Not found }
 */
router.get('/:id', authenticate, ctrl.getById);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status [ADMIN]
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string }
 *     responses:
 *       200: { description: Status updated }
 */
router.patch('/:id/status', authenticate, authorize('ADMIN'), updateOrderStatusValidators, validate, ctrl.updateStatus);

module.exports = router;
