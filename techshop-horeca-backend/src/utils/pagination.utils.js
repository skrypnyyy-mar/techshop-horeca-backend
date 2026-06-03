/**
 * Build a Prisma-compatible pagination object + meta info.
 *
 * @param {object} query  - Express req.query
 * @param {number} [defaultLimit=20]
 * @returns {{ skip: number, take: number, page: number, limit: number }}
 */
const getPagination = (query, defaultLimit = 20) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  const skip = (page - 1) * limit;
  return { skip, take: limit, page, limit };
};

/**
 * Build pagination meta block for responses.
 *
 * @param {number} total   - Total records in DB
 * @param {number} page
 * @param {number} limit
 */
const buildMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});

module.exports = { getPagination, buildMeta };
