const prisma = require('../config/db');

class BookingRepository {
  async create(data) {
    return prisma.booking.create({
      data,
      include: {
        horecaItem: { select: { id: true, name: true, brand: true, imageUrl: true } }
      }
    });
  }

  async findAll(where = {}, skip = 0, take = 20) {
    const [total, items] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          horecaItem: { select: { id: true, name: true, brand: true, imageUrl: true } },
          user: { select: { id: true, name: true, email: true } }
        }
      })
    ]);
    return { items, total };
  }

  async findById(id) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        horecaItem: true,
        user: { select: { id: true, name: true, email: true, phone: true } }
      }
    });
  }

  async updateStatus(id, status) {
    return prisma.booking.update({
      where: { id },
      data: { status }
    });
  }
}

module.exports = new BookingRepository();
