const request = require('supertest');
const express = require('express');
const { connectDatabase } = require('../src/config/database');

let app;

beforeAll(async () => {
  await connectDatabase();
  app = express();
  app.use(express.json());
  app.use('/api/auth', require('../src/routes/auth'));
});

describe('Auth API', () => {
  const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'testpassword123'
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.token).toBeDefined();
  });

  it('should not register the same user twice', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.statusCode).toBe(400);
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });
    expect(res.statusCode).toBe(401);
  });
}); 