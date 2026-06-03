const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (ADMIN only)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users [ADMIN]
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: query, name: role, schema: { type: string } }
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: page, schema: { type: integer } }
 *       - { in: query, name: limit, schema: { type: integer } }
 *     responses:
 *       200: { description: Paginated users }
 */
router.get('/', authenticate, authorize('ADMIN'), ctrl.list);

/**
 * @swagger
 * /users/{id}/role:
 *   patch:
 *     summary: Change user role [ADMIN]
 *     tags: [Users]
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
 *             required: [role]
 *             properties:
 *               role: { type: string, enum: [CLIENT, HORECA_MANAGER, ADMIN] }
 *     responses:
 *       200: { description: Role updated }
 */
router.patch('/:id/role', authenticate, authorize('ADMIN'), ctrl.changeRole);

/**
 * @swagger
 * /users/{id}/toggle-active:
 *   patch:
 *     summary: Activate or deactivate user account [ADMIN]
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: User activation toggled }
 */
router.patch('/:id/toggle-active', authenticate, authorize('ADMIN'), ctrl.toggleActive);

module.exports = router;
