const { ApiError } = require('../middlewares/errorHandler');
const { getPagination, buildMeta } = require('../utils/pagination.utils');

class HoReCaService {
  constructor(horecaRepository) {
    this.horecaRepository = horecaRepository;
  }

  async list(query) {
    const { skip, take, page, limit } = getPagination(query);

    const where = {};
    if (query.category) where.category = query.category;
    if (query.inStock !== undefined) where.inStock = query.inStock === 'true';
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { brand: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.minPrice || query.maxPrice) {
      where.priceBuy = {};
      if (query.minPrice) where.priceBuy.gte = parseFloat(query.minPrice);
      if (query.maxPrice) where.priceBuy.lte = parseFloat(query.maxPrice);
    }

    const { items, total } = await this.horecaRepository.findAll(where, skip, take);
    return { items, meta: buildMeta(total, page, limit) };
  }

  async getById(id) {
    const item = await this.horecaRepository.findById(id);
    if (!item) throw new ApiError(404, 'HoReCa item not found');
    return item;
  }

  async create(data) {
    return this.horecaRepository.create(data);
  }

  async update(id, data) {
    await this.getById(id);
    return this.horecaRepository.update(id, data);
  }

  async remove(id) {
    await this.getById(id);
    return this.horecaRepository.delete(id);
  }
}

module.exports = HoReCaService;
