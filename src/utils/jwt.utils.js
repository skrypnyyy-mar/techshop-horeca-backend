const jwt = require('jsonwebtoken');
const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} = require('../config/env');

/**
 * Sign an access token.
 * @param {{ id: string, role: string }} payload
 * @returns {string}
 */
const signAccessToken = (payload) =>
  jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN });

/**
 * Sign a refresh token.
 * @param {{ id: string }} payload
 * @returns {string}
 */
const signRefreshToken = (payload) =>
  jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });

/**
 * Verify an access token.
 * @param {string} token
 * @returns {object}
 */
const verifyAccessToken = (token) => jwt.verify(token, JWT_ACCESS_SECRET);

/**
 * Verify a refresh token.
 * @param {string} token
 * @returns {object}
 */
const verifyRefreshToken = (token) => jwt.verify(token, JWT_REFRESH_SECRET);

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
