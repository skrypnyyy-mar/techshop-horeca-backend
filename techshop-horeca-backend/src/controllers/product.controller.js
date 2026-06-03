const productRepository = require('../repositories/product.repository');
const ProductService = require('../services/product.service');
const { sendSuccess } = require('../utils/response.utils');

const productService = new ProductService(productRepository);

const list = async (req, res, next) => {
  try {
    const result = await productService.list(req.query);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const product = await productService.getById(req.params.id);
    sendSuccess(res, product);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const product = await productService.create(req.body);
    sendSuccess(res, product, 201);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const product = await productService.update(req.params.id, req.body);
    sendSuccess(res, product);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await productService.remove(req.params.id);
    sendSuccess(res, null);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, create, update, remove };
