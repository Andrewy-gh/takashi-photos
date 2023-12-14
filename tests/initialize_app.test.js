const request = require('supertest');
const { checkAdminPresence } = require('../controllers/config'); // Adjust the path accordingly
const express = require('express');

// Mocking the Config model for testing
jest.mock('../models/Config', () => ({
  findOne: jest.fn(),
}));

describe('checkAdminPresence', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('No admin present', async () => {
    // Mock the Config.findOne to return a config with no adminCreated
    require('../models/Config').findOne.mockResolvedValue({
      adminCreated: false,
    });

    const app = express(); // Assuming you're using Express
    app.get('/api/config', checkAdminPresence);

    const response = await request(app).get('/api/config');

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('No admin present');
  });

  test('Admin setup complete', async () => {
    // Mock the Config.findOne to return a config with adminCreated
    require('../models/Config').findOne.mockResolvedValue({
      adminCreated: true,
    });

    const app = express(); // Assuming you're using Express
    app.get('/api/config', checkAdminPresence);

    const response = await request(app).get('/api/config');

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('Admin setup complete');
  });
});
