const prisma = require('../config/db');
const { getPagination, buildMeta } = require('../utils/pagination.utils');

const create = async (userId, { deliveryAddress, notes, items }) => {
  // Verify all products exist and compute total
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== productIds.length) {
    const foundIds = new Set(products.map((p) => p.id));
    const missing = productIds.filter((id) => !foundIds.has(id));
    const err = new Error(`Products not found: ${missing.join(', ')}`);
    err.statusCode = 404;
    throw err;
  }

  const priceMap = Object.fromEntries(products.map((p) => [p.id, p.price]));
  const totalAmount = items.reduce(
    (sum, i) => sum + parseFloat(priceMap[i.productId]) * i.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      userId,
      deliveryAddress,
      notes,
      totalAmount,
      items: {
        create: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          priceAtOrder: priceMap[i.productId],
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  return order;
};

const list = async (userId, role, query) => {
  const { skip, take, page, limit } = getPagination(query);

  const where = role === 'ADMIN' ? {} : { userId };
  if (query.status) where.status = query.status;

  const [total, items] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: { select: { id: true, name: true, imageUrl: true } } } } },
    }),
  ]);

  return { items, meta: buildMeta(total, page, limit) };
};

const getById = async (id, userId, role) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } }, user: { select: { id: true, name: true, email: true } } },
  });

  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }
  if (role !== 'ADMIN' && order.userId !== userId) {
    const err = new Error('Access denied');
    err.statusCode = 403;
    throw err;
  }
  return order;
};

const updateStatus = async (id, status) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }
  return prisma.order.update({ where: { id }, data: { status } });
};

module.exports = { create, list, getById, updateStatus };
