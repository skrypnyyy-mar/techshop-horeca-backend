const { ApiError } = require('../middlewares/errorHandler');
const { getPagination, buildMeta } = require('../utils/pagination.utils');

class OrderService {
  constructor(orderRepository, productRepository) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
  }

  async create(userId, { deliveryAddress, notes, items }) {
    const productIds = items.map((i) => i.productId);
    const products = await this.productRepository.findManyByIds(productIds);

    if (products.length !== productIds.length) {
      const foundIds = new Set(products.map((p) => p.id));
      const missing = productIds.filter((id) => !foundIds.has(id));
      throw new ApiError(404, `Products not found: ${missing.join(', ')}`);
    }

    const priceMap = Object.fromEntries(products.map((p) => [p.id, p.price]));
    const totalAmount = items.reduce((sum, i) => sum + parseFloat(priceMap[i.productId]) * i.quantity, 0);

    return this.orderRepository.create({
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
    });
  }

  async list(userId, role, query) {
    const { skip, take, page, limit } = getPagination(query);
    const where = role === 'ADMIN' ? {} : { userId };
    if (query.status) where.status = query.status;

    const { items, total } = await this.orderRepository.findAll(where, skip, take);
    return { items, meta: buildMeta(total, page, limit) };
  }

  async getById(id, userId, role) {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new ApiError(404, 'Order not found');
    
    if (role !== 'ADMIN' && order.userId !== userId) {
      throw new ApiError(403, 'Access denied');
    }
    return order;
  }

  async updateStatus(id, status) {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new ApiError(404, 'Order not found');
    return this.orderRepository.updateStatus(id, status);
  }
}

module.exports = OrderService;
