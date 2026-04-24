const router = require('express').Router();
const ctrl = require('../controllers/horeca.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
  createHorecaValidators,
  updateHorecaValidators,
} = require('../validators/horeca.validators');

/**
 * @swagger
 * tags:
 *   name: HoReCa
 *   description: HoReCa equipment catalog
 */

/**
 * @swagger
 * /horeca/categories:
 *   get:
 *     summary: List HoReCa categories
 *     tags: [HoReCa]
 *     responses:
 *       200: { description: Categories list }
 */
router.get('/categories', ctrl.getCategories);

/**
 * @swagger
 * /horeca:
 *   get:
 *     summary: List HoReCa equipment with filters & pagination
 *     tags: [HoReCa]
 *     parameters:
 *       - { in: query, name: category, schema: { type: string } }
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: inStock, schema: { type: boolean } }
 *       - { in: query, name: minPrice, schema: { type: number } }
 *       - { in: query, name: maxPrice, schema: { type: number } }
 *       - { in: query, name: page, schema: { type: integer } }
 *       - { in: query, name: limit, schema: { type: integer } }
 *     responses:
 *       200: { description: Paginated equipment list }
 */
router.get('/', ctrl.list);

/**
 * @swagger
 * /horeca/{id}:
 *   get:
 *     summary: Get HoReCa item details
 *     tags: [HoReCa]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Item details with specs }
 *       404: { description: Not found }
 */
router.get('/:id', ctrl.getById);

/**
 * @swagger
 * /horeca:
 *   post:
 *     summary: Create HoReCa item [ADMIN]
 *     tags: [HoReCa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201: { description: Item created }
 */
router.post('/', authenticate, authorize('ADMIN'), createHorecaValidators, validate, ctrl.create);

/**
 * @swagger
 * /horeca/{id}:
 *   put:
 *     summary: Update HoReCa item [ADMIN]
 *     tags: [HoReCa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Item updated }
 */
router.put('/:id', authenticate, authorize('ADMIN'), updateHorecaValidators, validate, ctrl.update);

/**
 * @swagger
 * /horeca/{id}:
 *   delete:
 *     summary: Delete HoReCa item [ADMIN]
 *     tags: [HoReCa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Item deleted }
 */
router.delete('/:id', authenticate, authorize('ADMIN'), ctrl.remove);

module.exports = router;
