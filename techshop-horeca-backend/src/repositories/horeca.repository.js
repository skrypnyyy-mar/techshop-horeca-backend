const prisma = require('../config/db');

class HorecaRepository {
  async findAll(where = {}, skip = 0, take = 20) {
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
    return { items, total };
  }

  async findById(id) {
    return prisma.horecaItem.findUnique({
      where: { id },
      include: { specs: true },
    });
  }

  async create(data) {
    const { specs, ...itemData } = data;
    return prisma.horecaItem.create({
      data: {
        ...itemData,
        specs: specs ? { create: specs } : undefined,
      },
      include: { specs: true },
    });
  }

  async update(id, data) {
    const { specs, ...itemData } = data;
    return prisma.$transaction(async (tx) => {
      if (specs) {
        await tx.horecaSpec.deleteMany({ where: { horecaItemId: id } });
        await tx.horecaSpec.createMany({
          data: specs.map(spec => ({ ...spec, horecaItemId: id })),
        });
      }
      return tx.horecaItem.update({
        where: { id },
        data: itemData,
        include: { specs: true },
      });
    });
  }

  async delete(id) {
    return prisma.horecaItem.delete({
      where: { id },
    });
  }
}

module.exports = new HorecaRepository();
