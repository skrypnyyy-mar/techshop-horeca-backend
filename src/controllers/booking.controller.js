const bookingService = require('../services/booking.service');
const { sendSuccess, sendError } = require('../utils/response.utils');

const create = async (req, res) => {
  try {
    const booking = await bookingService.create(req.user.id, req.body);
    sendSuccess(res, booking, 'Booking created', 201);
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

const list = async (req, res) => {
  try {
    const result = await bookingService.list(req.user.id, req.user.role, req.query);
    sendSuccess(res, result);
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

const getById = async (req, res) => {
  try {
    const booking = await bookingService.getById(req.params.id, req.user.id, req.user.role);
    sendSuccess(res, booking);
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

const updateStatus = async (req, res) => {
  try {
    const booking = await bookingService.updateStatus(req.params.id, req.body.status);
    sendSuccess(res, booking, 'Booking status updated');
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

const cancel = async (req, res) => {
  try {
    const booking = await bookingService.cancel(req.params.id, req.user.id, req.user.role);
    sendSuccess(res, booking, 'Booking cancelled');
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

module.exports = { create, list, getById, updateStatus, cancel };
