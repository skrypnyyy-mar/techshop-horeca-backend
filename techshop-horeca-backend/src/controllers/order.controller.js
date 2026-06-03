const orderRepository = require('../repositories/order.repository');
const productRepository = require('../repositories/product.repository');
const OrderService = require('../services/order.service');
const { sendSuccess } = require('../utils/response.utils');

const orderService = new OrderService(orderRepository, productRepository);

const create = async (req, res, next) => {
  try {
    const order = await orderService.create(req.user.id, req.body);
    sendSuccess(res, order, 'Order created', 201);
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const result = await orderService.list(req.user.id, req.user.role, req.query);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const order = await orderService.getById(req.params.id, req.user.id, req.user.role);
    sendSuccess(res, order);
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateStatus(req.params.id, req.body.status);
    sendSuccess(res, order, 'Order status updated');
  } catch (err) {
    next(err);
  }
};

module.exports = { create, list, getById, updateStatus };
