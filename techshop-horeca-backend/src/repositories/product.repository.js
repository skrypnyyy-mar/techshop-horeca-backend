const prisma = require('../config/db');

class ProductRepository {
  async findAll(where = {}, skip = 0, take = 20) {
    const [total, items] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { items, total };
  }

  async findById(id) {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async create(data) {
    return prisma.product.create({
      data,
    });
  }

  async update(id, data) {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return prisma.product.delete({
      where: { id },
    });
  }

  async count(where = {}) {
    return prisma.product.count({ where });
  }

  async findManyByIds(ids) {
    return prisma.product.findMany({
      where: { id: { in: ids } },
    });
  }
}

module.exports = new ProductRepository();
