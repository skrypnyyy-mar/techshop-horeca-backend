const userRepository = require('../repositories/user.repository');
const UserService = require('../services/user.service');
const { sendSuccess } = require('../utils/response.utils');

const userService = new UserService(userRepository);

const list = async (req, res, next) => {
  try {
    const result = await userService.list(req.query);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

const changeRole = async (req, res, next) => {
  try {
    const updated = await userService.changeRole(req.params.id, req.body.role);
    sendSuccess(res, updated);
  } catch (err) {
    next(err);
  }
};

const toggleActive = async (req, res, next) => {
  try {
    const updated = await userService.toggleActive(req.params.id);
    sendSuccess(res, updated);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, changeRole, toggleActive };
