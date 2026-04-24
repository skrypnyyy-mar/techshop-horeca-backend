const prisma = require('../config/db');
const { getPagination, buildMeta } = require('../utils/pagination.utils');

const list = async (query) => {
  const { skip, take, page, limit } = getPagination(query);

  const where = {};
  if (query.category) where.category = query.category;
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { tagline: { contains: query.search, mode: 'insensitive' } },
      { brand: { contains: query.search, mode: 'insensitive' } },
    ];
  }
  if (query.inStock !== undefined) where.inStock = query.inStock === 'true';
  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price.gte = parseFloat(query.minPrice);
    if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice);
  }

  const [total, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return { items, meta: buildMeta(total, page, limit) };
};

const getById = async (id) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
};

const create = async (data) => {
  return prisma.product.create({ data });
};

const update = async (id, data) => {
  await getById(id); // ensure exists
  return prisma.product.update({ where: { id }, data });
};

const remove = async (id) => {
  await getById(id);
  await prisma.product.delete({ where: { id } });
};

const getCategories = () => {
  return ['PHONES', 'LAPTOPS', 'AUDIO', 'WEARABLES', 'TABLETS', 'ACCESSORIES'];
};

module.exports = { list, getById, create, update, remove, getCategories };
