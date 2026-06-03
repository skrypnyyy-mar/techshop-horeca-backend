const request = require('supertest');
const app = require('../app');

describe('Product API', () => {
  it('should return a list of products', async () => {
    const res = await request(app).get('/api/products');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.items)).toBe(true);
  });

  it('should return 404 for non-existent product', async () => {
    const res = await request(app).get('/api/products/non-existent-id');
    
    expect(res.statusCode).toEqual(404);
    expect(res.body.status).toBe('fail');
  });
});
