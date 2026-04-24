const orderService = require('../services/order.service');
const { sendSuccess, sendError } = require('../utils/response.utils');

const create = async (req, res) => {
  try {
    const order = await orderService.create(req.user.id, req.body);
    sendSuccess(res, order, 'Order created', 201);
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

const list = async (req, res) => {
  try {
    const result = await orderService.list(req.user.id, req.user.role, req.query);
    sendSuccess(res, result);
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

const getById = async (req, res) => {
  try {
    const order = await orderService.getById(req.params.id, req.user.id, req.user.role);
    sendSuccess(res, order);
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

const updateStatus = async (req, res) => {
  try {
    const order = await orderService.updateStatus(req.params.id, req.body.status);
    sendSuccess(res, order, 'Order status updated');
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

module.exports = { create, list, getById, updateStatus };
