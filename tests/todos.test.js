const request = require('supertest');
const express = require('express');
const { connectDatabase } = require('../src/config/database');

let app;
let token;
let todoId;

beforeAll(async () => {
  await connectDatabase();
  app = express();
  app.use(express.json());
  app.use('/api/auth', require('../src/routes/auth'));
  app.use('/api/todos', require('../src/routes/todos'));

  // Register and login a user to get a token
  const testUser = {
    name: 'Todo Tester',
    email: 'todouser@example.com',
    password: 'todopassword123'
  };
  await request(app).post('/api/auth/register').send(testUser);
  const res = await request(app).post('/api/auth/login').send({
    email: testUser.email,
    password: testUser.password
  });
  token = res.body.token;
});

describe('Todos API', () => {
  it('should create a new todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Todo', description: 'Test Description' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Todo');
    todoId = res.body.id;
  });

  it('should get all todos for the user', async () => {
    const res = await request(app)
      .get('/api/todos')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should update a todo', async () => {
    const res = await request(app)
      .put(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ completed: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it('should delete a todo', async () => {
    const res = await request(app)
      .delete(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
  });
}); 