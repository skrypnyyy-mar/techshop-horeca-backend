const prisma = require('../config/db');
const { getPagination, buildMeta } = require('../utils/pagination.utils');

const list = async (query) => {
  const { skip, take, page, limit } = getPagination(query);

  const where = {};
  if (query.category) where.category = query.category;
  if (query.inStock !== undefined) where.inStock = query.inStock === 'true';
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { brand: { contains: query.search, mode: 'insensitive' } },
      { tagline: { contains: query.search, mode: 'insensitive' } },
    ];
  }
  if (query.minPrice || query.maxPrice) {
    where.priceBuy = {};
    if (query.minPrice) where.priceBuy.gte = parseFloat(query.minPrice);
    if (query.maxPrice) where.priceBuy.lte = parseFloat(query.maxPrice);
  }

  const [total, items] = await Promise.all([
    prisma.horecaItem.count({ where }),
    prisma.horecaItem.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { specs: true },
    }),
  ]);

  return { items, meta: buildMeta(total, page, limit) };
};

const getById = async (id) => {
  const item = await prisma.horecaItem.findUnique({
    where: { id },
    include: { specs: true },
  });
  if (!item) {
    const err = new Error('HoReCa item not found');
    err.statusCode = 404;
    throw err;
  }
  return item;
};

const create = async ({ specs, ...data }) => {
  return prisma.horecaItem.create({
    data: {
      ...data,
      specs: specs?.length
        ? { create: specs.map(({ label, value }) => ({ label, value })) }
        : undefined,
    },
    include: { specs: true },
  });
};

const update = async (id, { specs, ...data }) => {
  await getById(id);

  return prisma.$transaction(async (tx) => {
    if (specs !== undefined) {
      await tx.horecaSpec.deleteMany({ where: { horecaItemId: id } });
      if (specs.length) {
        await tx.horecaSpec.createMany({
          data: specs.map(({ label, value }) => ({ label, value, horecaItemId: id })),
        });
      }
    }
    return tx.horecaItem.update({
      where: { id },
      data,
      include: { specs: true },
    });
  });
};

const remove = async (id) => {
  await getById(id);
  await prisma.horecaItem.delete({ where: { id } });
};

const getCategories = () => [
  'COFFEE_MACHINES', 'OVENS', 'REFRIGERATION',
  'MIXERS', 'DISHWASHERS', 'STOVES', 'OTHER',
];

module.exports = { list, getById, create, update, remove, getCategories };
