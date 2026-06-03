const { ApiError } = require('../middlewares/errorHandler');
const { getPagination, buildMeta } = require('../utils/pagination.utils');

const MANAGER_ROLES = ['ADMIN', 'HORECA_MANAGER'];

class BookingService {
  constructor(bookingRepository, horecaRepository) {
    this.bookingRepository = bookingRepository;
    this.horecaRepository = horecaRepository;
  }

  async create(userId, data) {
    const item = await this.horecaRepository.findById(data.horecaItemId);
    if (!item) throw new ApiError(404, 'HoReCa item not found');

    let totalPrice = data.totalPrice;
    if (!totalPrice) {
      if (data.bookingType === 'BUY') {
        totalPrice = item.priceBuy;
      } else if (data.startDate && data.endDate) {
        const days = Math.max(1, Math.ceil((new Date(data.endDate) - new Date(data.startDate)) / 86400000));
        totalPrice = parseFloat(item.pricePerDay) * days;
      } else {
        totalPrice = item.pricePerDay;
      }
    }

    return this.bookingRepository.create({ ...data, userId, totalPrice });
  }

  async list(userId, role, query) {
    const { skip, take, page, limit } = getPagination(query);
    const where = MANAGER_ROLES.includes(role) ? {} : { userId };
    
    if (query.status) where.status = query.status;
    if (query.bookingType) where.bookingType = query.bookingType;

    const { items, total } = await this.bookingRepository.findAll(where, skip, take);
    return { items, meta: buildMeta(total, page, limit) };
  }

  async getById(id, userId, role) {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) throw new ApiError(404, 'Booking not found');
    
    if (!MANAGER_ROLES.includes(role) && booking.userId !== userId) {
      throw new ApiError(403, 'Access denied');
    }
    return booking;
  }

  async updateStatus(id, status) {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) throw new ApiError(404, 'Booking not found');
    return this.bookingRepository.updateStatus(id, status);
  }

  async cancel(id, userId, role) {
    const booking = await this.getById(id, userId, role);
    if (!MANAGER_ROLES.includes(role) && booking.status !== 'PENDING') {
      throw new ApiError(400, 'Only PENDING bookings can be cancelled by the owner');
    }
    return this.bookingRepository.updateStatus(id, 'CANCELLED');
  }
}

module.exports = BookingService;
