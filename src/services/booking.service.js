const prisma = require('../config/db');
const { getPagination, buildMeta } = require('../utils/pagination.utils');

const MANAGER_ROLES = ['ADMIN', 'HORECA_MANAGER'];

const create = async (userId, data) => {
  const item = await prisma.horecaItem.findUnique({ where: { id: data.horecaItemId } });
  if (!item) {
    const err = new Error('HoReCa item not found');
    err.statusCode = 404;
    throw err;
  }

  // Auto-compute price if RENT + dates provided
  let totalPrice = data.totalPrice;
  if (!totalPrice) {
    if (data.bookingType === 'BUY') {
      totalPrice = item.priceBuy;
    } else if (data.startDate && data.endDate) {
      const days = Math.max(
        1,
        Math.ceil((new Date(data.endDate) - new Date(data.startDate)) / 86400000)
      );
      totalPrice = parseFloat(item.pricePerDay) * days;
    } else {
      totalPrice = item.pricePerDay;
    }
  }

  return prisma.booking.create({
    data: { ...data, userId, totalPrice },
    include: {
      horecaItem: { select: { id: true, name: true, brand: true, imageUrl: true } },
    },
  });
};

const list = async (userId, role, query) => {
  const { skip, take, page, limit } = getPagination(query);

  const where = MANAGER_ROLES.includes(role) ? {} : { userId };
  if (query.status) where.status = query.status;
  if (query.bookingType) where.bookingType = query.bookingType;

  const [total, items] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        horecaItem: { select: { id: true, name: true, brand: true, imageUrl: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    }),
  ]);

  return { items, meta: buildMeta(total, page, limit) };
};

const getById = async (id, userId, role) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      horecaItem: true,
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  if (!booking) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }
  if (!MANAGER_ROLES.includes(role) && booking.userId !== userId) {
    const err = new Error('Access denied');
    err.statusCode = 403;
    throw err;
  }
  return booking;
};

const updateStatus = async (id, status) => {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }
  return prisma.booking.update({ where: { id }, data: { status } });
};

const cancel = async (id, userId, role) => {
  const booking = await getById(id, userId, role);
  if (!MANAGER_ROLES.includes(role) && booking.status !== 'PENDING') {
    const err = new Error('Only PENDING bookings can be cancelled by the owner');
    err.statusCode = 400;
    throw err;
  }
  return prisma.booking.update({ where: { id }, data: { status: 'CANCELLED' } });
};

module.exports = { create, list, getById, updateStatus, cancel };
