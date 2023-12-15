const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Image = require('../models/Image');
const ImageOrder = require('../models/ImageOrder');

const sampleImageOrder = {
  order: [
    {
      title: 'Sample Image 1',
      url: 'https://example.com/sample-image.jpg',
      type: 'jpg',
      cloudinaryId: 'sample-cloudinary-id',
      createdAt: new Date(),
    },
    {
      title: 'Sample Image 2',
      url: 'https://example.com/sample-image-2.jpg',
      type: 'jpg',
      cloudinaryId: 'sample-cloudinary-id-2',
      createdAt: new Date(),
    },
  ],
};
beforeEach(async () => {
  await ImageOrder.deleteMany({});
  await Image.deleteMany({});
  const imageOrder = new ImageOrder();
  let image = new Image(sampleImageOrder.order[0]);
  await image.save();
  imageOrder.order.push(image);
  image = new Image(sampleImageOrder.order[1]);
  await image.save();
  imageOrder.order.push(image);
  await imageOrder.save();
});

test('images are returned as json', async () => {
  await api.get('/api/images').expect('Content-Type', /application\/json/);
});

test('all images are returned', async () => {
  const res = await api.get('/api/images');
  expect(res.body).toHaveLength(sampleImageOrder.order.length);
});

test('a specific image title is within the returned images', async () => {
  const res = await api.get('/api/images');
  const contents = res.body.map((r) => r.title);
  expect(contents).toContain('Sample Image 2');
});

afterAll(async () => {
  await mongoose.connection.close();
});
