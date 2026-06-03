const prisma = require('../config/db');

class OrderRepository {
  async create(data) {
    return prisma.order.create({
      data,
      include: {
        items: {
          include: { product: { select: { id: true, name: true, price: true } } }
        }
      }
    });
  }

  async findAll(where = {}, skip = 0, take = 20) {
    const [total, items] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: { product: { select: { id: true, name: true, price: true } } }
          }
        }
      })
    ]);
    return { items, total };
  }

  async findById(id) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: { select: { id: true, name: true, price: true } } }
        },
        user: { select: { id: true, name: true, email: true } }
      }
    });
  }

  async updateStatus(id, status) {
    return prisma.order.update({
      where: { id },
      data: { status }
    });
  }
}

module.exports = new OrderRepository();
