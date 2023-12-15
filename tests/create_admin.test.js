const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const { createAdmin } = require('../controllers/config'); // Adjust the path accordingly
const Config = require('../models/Config'); // Adjust the path accordingly
const User = require('../models/User'); // Adjust the path accordingly

// Mocking the Config and User models for testing
jest.mock('../models/Config'); // Adjust the path accordingly
jest.mock('../models/User'); // Adjust the path accordingly

describe('createAdmin', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('Admin creation success', async () => {
    Config.findOne = jest.fn().mockImplementation(() => ({
      save: () =>
        jest.fn().mockResolvedValue({
          _id: new mongoose.Types.ObjectId(),
          imageOrderCreated: true,
          adminCreated: false,
        }),
    }));
    User.findOne.mockResolvedValue(null);

    const app = express();
    app.use(express.json());
    app.post('/api/admin', createAdmin);

    const response = await request(app)
      .post('/api/admin')
      .send({ email: 'admin@example.com', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Admin successfully created');
  });

  test('Admin creation fails due to existing user', async () => {
    Config.findOne.mockResolvedValue({ adminCreated: true });
    User.findOne.mockResolvedValue({ email: 'admin@example.com' });

    const app = express();
    app.use(express.json());
    app.post('/api/admin', createAdmin);

    const response = await request(app)
      .post('/api/admin')
      .send({ email: 'admin@example.com', password: 'password123' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('email must be unique');
  });
});
