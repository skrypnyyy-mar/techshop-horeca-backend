const bookingRepository = require('../repositories/booking.repository');
const horecaRepository = require('../repositories/horeca.repository');
const BookingService = require('../services/booking.service');
const { sendSuccess } = require('../utils/response.utils');

const bookingService = new BookingService(bookingRepository, horecaRepository);

const create = async (req, res, next) => {
  try {
    const booking = await bookingService.create(req.user.id, req.body);
    sendSuccess(res, booking, 201);
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const result = await bookingService.list(req.user.id, req.user.role, req.query);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const booking = await bookingService.getById(req.params.id, req.user.id, req.user.role);
    sendSuccess(res, booking);
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const booking = await bookingService.updateStatus(req.params.id, req.body.status);
    sendSuccess(res, booking);
  } catch (err) {
    next(err);
  }
};

const cancel = async (req, res, next) => {
  try {
    const booking = await bookingService.cancel(req.params.id, req.user.id, req.user.role);
    sendSuccess(res, booking);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, list, getById, updateStatus, cancel };
