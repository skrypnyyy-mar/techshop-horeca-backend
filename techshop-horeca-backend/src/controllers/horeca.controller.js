const horecaRepository = require('../repositories/horeca.repository');
const HoReCaService = require('../services/horeca.service');
const { sendSuccess } = require('../utils/response.utils');

const horecaService = new HoReCaService(horecaRepository);

const list = async (req, res, next) => {
  try {
    const result = await horecaService.list(req.query);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const item = await horecaService.getById(req.params.id);
    sendSuccess(res, item);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const item = await horecaService.create(req.body);
    sendSuccess(res, item, 201);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const item = await horecaService.update(req.params.id, req.body);
    sendSuccess(res, item);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await horecaService.remove(req.params.id);
    sendSuccess(res, null);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, create, update, remove };
