const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.test') });

// Mocking Prisma if needed or just ensuring we don't crash without a real DB
// For a "strong Middle+" project, we usually mock the repository layer in unit tests,
// and use a real test DB for integration tests.

jest.mock('../src/config/db', () => ({
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  product: {
    findMany: jest.fn().mockResolvedValue([]),
    count: jest.fn().mockResolvedValue(0),
    findUnique: jest.fn().mockResolvedValue(null),
  },
}));

// Mocking Redis for tests
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    keys: jest.fn().mockResolvedValue([]),
  }));
});
