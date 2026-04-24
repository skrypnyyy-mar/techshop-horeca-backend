const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../config/db');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt.utils');
const { JWT_REFRESH_EXPIRES_IN } = require('../config/env');

/** Parse refresh token TTL string (e.g. "7d") → milliseconds */
const parseTTL = (ttl) => {
  const units = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  const match = ttl.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 86400000;
  return parseInt(match[1], 10) * units[match[2]];
};

const register = async ({ email, password, name, phone }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash, name, phone },
    select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
  });

  const tokens = await _issueTokens(user.id, user.role);
  return { user, ...tokens };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const tokens = await _issueTokens(user.id, user.role);
  const { passwordHash, ...safeUser } = user;
  return { user: safeUser, ...tokens };
};

const refresh = async (token) => {
  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    const err = new Error('Invalid or expired refresh token');
    err.statusCode = 401;
    throw err;
  }

  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.expiresAt < new Date()) {
    const err = new Error('Refresh token revoked or expired');
    err.statusCode = 401;
    throw err;
  }

  const user = await prisma.user.findUnique({ where: { id: stored.userId } });
  if (!user || !user.isActive) {
    const err = new Error('User not found or inactive');
    err.statusCode = 401;
    throw err;
  }

  // Rotate: delete old, issue new
  await prisma.refreshToken.delete({ where: { token } });
  return _issueTokens(user.id, user.role);
};

const logout = async (token) => {
  await prisma.refreshToken.deleteMany({ where: { token } });
};

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
  });
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
};

// ── private ──────────────────────────────────────────────────────────────────

const _issueTokens = async (userId, role) => {
  const accessToken = signAccessToken({ id: userId, role });
  const rawRefresh = uuidv4();
  const refreshToken = signRefreshToken({ id: userId });
  const expiresAt = new Date(Date.now() + parseTTL(JWT_REFRESH_EXPIRES_IN));

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId, expiresAt },
  });

  return { accessToken, refreshToken };
};

module.exports = { register, login, refresh, logout, getMe };
