const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/response.utils');

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    sendSuccess(res, result, 'Registration successful', 201);
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    sendSuccess(res, result, 'Login successful');
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

const refresh = async (req, res) => {
  try {
    const tokens = await authService.refresh(req.body.refreshToken);
    sendSuccess(res, tokens, 'Tokens refreshed');
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

const logout = async (req, res) => {
  try {
    await authService.logout(req.body.refreshToken);
    sendSuccess(res, null, 'Logged out successfully');
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

const me = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);
    sendSuccess(res, user);
  } catch (err) {
    sendError(res, err.message, err.statusCode || 500);
  }
};

module.exports = { register, login, refresh, logout, me };
