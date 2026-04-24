const prisma = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response.utils');
const { getPagination, buildMeta } = require('../utils/pagination.utils');

const list = async (req, res) => {
  try {
    const { skip, take, page, limit } = getPagination(req.query);
    const where = {};
    if (req.query.role) where.role = req.query.role;
    if (req.query.search) {
      where.OR = [
        { name: { contains: req.query.search, mode: 'insensitive' } },
        { email: { contains: req.query.search, mode: 'insensitive' } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, name: true, phone: true,
          role: true, isActive: true, createdAt: true,
        },
      }),
    ]);

    sendSuccess(res, { items: users, meta: buildMeta(total, page, limit) });
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

const changeRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['CLIENT', 'HORECA_MANAGER', 'ADMIN'];
    if (!validRoles.includes(role)) {
      return sendError(res, `Invalid role. Must be one of: ${validRoles.join(', ')}`, 400);
    }

    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return sendError(res, 'User not found', 404);

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });

    sendSuccess(res, updated, 'User role updated');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

const toggleActive = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return sendError(res, 'User not found', 404);

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive: !user.isActive },
      select: { id: true, email: true, name: true, isActive: true },
    });

    sendSuccess(res, updated, `User ${updated.isActive ? 'activated' : 'deactivated'}`);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

module.exports = { list, changeRole, toggleActive };
