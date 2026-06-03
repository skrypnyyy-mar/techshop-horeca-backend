const router = require('express').Router();
const ctrl = require('../controllers/booking.controller');
const validate = require('../middlewares/validate-express');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const {
  createBookingValidators,
  updateBookingStatusValidators,
} = require('../validators/booking.validators');

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: HoReCa equipment booking (rent or buy)
 */

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a booking [AUTH]
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [horecaItemId, bookingType, contactName, contactPhone]
 *             properties:
 *               horecaItemId:  { type: string }
 *               bookingType:   { type: string, enum: [RENT, BUY] }
 *               startDate:     { type: string, format: date }
 *               endDate:       { type: string, format: date }
 *               contactName:   { type: string }
 *               contactPhone:  { type: string }
 *               notes:         { type: string }
 *     responses:
 *       201: { description: Booking created }
 */
router.post('/', authenticate, createBookingValidators, validate, ctrl.create);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: List bookings (own / all for ADMIN & HORECA_MANAGER)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: query, name: status, schema: { type: string } }
 *       - { in: query, name: bookingType, schema: { type: string } }
 *       - { in: query, name: page, schema: { type: integer } }
 *       - { in: query, name: limit, schema: { type: integer } }
 *     responses:
 *       200: { description: Paginated bookings }
 */
router.get('/', authenticate, ctrl.list);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get booking details [AUTH]
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Booking details }
 *       403: { description: Access denied }
 *       404: { description: Not found }
 */
router.get('/:id', authenticate, ctrl.getById);

/**
 * @swagger
 * /bookings/{id}/status:
 *   patch:
 *     summary: Update booking status [ADMIN, HORECA_MANAGER]
 *     tags: [Bookings]
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
 *               status: { type: string, enum: [PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELLED] }
 *     responses:
 *       200: { description: Status updated }
 */
router.patch(
  '/:id/status',
  authenticate,
  authorize('ADMIN', 'HORECA_MANAGER'),
  updateBookingStatusValidators,
  validate,
  ctrl.updateStatus
);

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Cancel own booking [AUTH] (PENDING only for clients)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Booking cancelled }
 */
router.delete('/:id', authenticate, ctrl.cancel);

module.exports = router;
