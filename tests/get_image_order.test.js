const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const { getImageOrder } = require('../controllers/image'); // Adjust the path accordingly
const ImageOrder = require('../models/ImageOrder');
const Image = require('../models/Image');

// Mocking the ImageOrder and Image models for testing
jest.mock('../models/ImageOrder');
jest.mock('../models/Image');

describe('getImageOrder', () => {
  test('Returns the Image Order', async () => {
    // Mock the ImageOrder.findOne to return a sample data
    const sampleImageOrder = {
      _id: new mongoose.Types.ObjectId(),
      order: [
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Sample Image',
          url: 'https://example.com/sample-image.jpg',
          type: 'jpg',
          cloudinaryId: 'sample-cloudinary-id',
          createdAt: new Date(),
        },
      ],
    };
    ImageOrder.findOne.mockResolvedValue(sampleImageOrder);

    // Mock the Image.findOne to return the image data
    Image.findOne.mockResolvedValue(sampleImageOrder.order[0]);

    const app = express();
    app.get('/api/image-order', getImageOrder);

    const response = await request(app).get('/api/image-order');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(sampleImageOrder.order);
  });
});
