const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const userRepository = require('../repositories/user.repository');
const prisma = require('../config/db'); // for token management
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt.utils');
const { JWT_REFRESH_EXPIRES_IN } = require('../config/env');
const { ApiError } = require('../middlewares/errorHandler');

class AuthService {
  async register(data) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new ApiError(409, 'Email already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await userRepository.create({
      email: data.email,
      passwordHash,
      name: data.name,
      phone: data.phone,
    });

    const tokens = await this._issueTokens(user.id, user.role);
    return { user: this._sanitizeUser(user), ...tokens };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.isActive) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const tokens = await this._issueTokens(user.id, user.role);
    return { user: this._sanitizeUser(user), ...tokens };
  }

  // ... other methods (refresh, logout, etc.) would be here ...

  _sanitizeUser(user) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async _issueTokens(userId, role) {
    const accessToken = signAccessToken({ id: userId, role });
    const refreshToken = signRefreshToken({ id: userId });
    
    // We can move RefreshToken logic to its own repository too
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: new Date(Date.now() + 7 * 86400000), // Default 7d
      },
    });

    return { accessToken, refreshToken };
  }
}

module.exports = new AuthService();
