const { ApiError } = require('../middlewares/errorHandler');
const { getPagination, buildMeta } = require('../utils/pagination.utils');

class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async list(query) {
    const { skip, take, page, limit } = getPagination(query);
    const where = query.category ? { category: query.category } : {};
    
    const { items, total } = await this.productRepository.findAll(where, skip, take);
    return { 
      items, 
      meta: buildMeta(total, page, limit) 
    };
  }

  async getById(id) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new ApiError(404, 'Product not found');
    return product;
  }

  async create(data) {
    return this.productRepository.create(data);
  }

  async update(id, data) {
    await this.getById(id);
    return this.productRepository.update(id, data);
  }

  async remove(id) {
    await this.getById(id);
    return this.productRepository.delete(id);
  }
}

module.exports = ProductService;
