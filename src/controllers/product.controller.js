const productService = require('../services/product.service');
const { sendSuccess, sendError } = require('../utils/response.utils');

const list = async (req, res) => {
  try {
    const result = await productService.list(req.query);
    sendSuccess(res, result);
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

const getById = async (req, res) => {
  try {
    const product = await productService.getById(req.params.id);
    sendSuccess(res, product);
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

const create = async (req, res) => {
  try {
    const product = await productService.create(req.body);
    sendSuccess(res, product, 'Product created', 201);
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

const update = async (req, res) => {
  try {
    const product = await productService.update(req.params.id, req.body);
    sendSuccess(res, product, 'Product updated');
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

const remove = async (req, res) => {
  try {
    await productService.remove(req.params.id);
    sendSuccess(res, null, 'Product deleted');
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

const getCategories = (req, res) => {
  sendSuccess(res, productService.getCategories());
};

module.exports = { list, getById, create, update, remove, getCategories };
