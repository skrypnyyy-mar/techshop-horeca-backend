const { ApiError } = require('../middlewares/errorHandler');
const { getPagination, buildMeta } = require('../utils/pagination.utils');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async list(query) {
    const { skip, take, page, limit } = getPagination(query);
    const where = {};
    if (query.role) where.role = query.role;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const { items, total } = await this.userRepository.findAll(where, skip, take);
    return { items, meta: buildMeta(total, page, limit) };
  }

  async changeRole(id, role) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new ApiError(404, 'User not found');

    const validRoles = ['CLIENT', 'HORECA_MANAGER', 'ADMIN'];
    if (!validRoles.includes(role)) {
      throw new ApiError(400, `Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }

    return this.userRepository.update(id, { role });
  }

  async toggleActive(id) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new ApiError(404, 'User not found');

    return this.userRepository.update(id, { isActive: !user.isActive });
  }
}

module.exports = UserService;
