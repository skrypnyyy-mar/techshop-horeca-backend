const request = require('supertest');
const app = require('../src/app');

describe('GET /api/products', () => {
  it('should return 200', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
  });
});
