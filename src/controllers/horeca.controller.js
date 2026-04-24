const horecaService = require('../services/horeca.service');
const { sendSuccess, sendError } = require('../utils/response.utils');

const list = async (req, res) => {
  try {
    const result = await horecaService.list(req.query);
    sendSuccess(res, result);
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

const getById = async (req, res) => {
  try {
    const item = await horecaService.getById(req.params.id);
    sendSuccess(res, item);
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

const create = async (req, res) => {
  try {
    const item = await horecaService.create(req.body);
    sendSuccess(res, item, 'HoReCa item created', 201);
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

const update = async (req, res) => {
  try {
    const item = await horecaService.update(req.params.id, req.body);
    sendSuccess(res, item, 'HoReCa item updated');
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

const remove = async (req, res) => {
  try {
    await horecaService.remove(req.params.id);
    sendSuccess(res, null, 'HoReCa item deleted');
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

const getCategories = (req, res) => {
  sendSuccess(res, horecaService.getCategories());
};

module.exports = { list, getById, create, update, remove, getCategories };
