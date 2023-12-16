const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

const ImageOrder = require('../models/ImageOrder');
const Image = require('../models/Image');
const User = require('../models/User');

const { createAndLoginAdmin } = require('./test_helper');

let token;
beforeAll(async () => {
  await ImageOrder.deleteMany({});
  await Image.deleteMany({});
  await User.deleteMany({});

  token = await createAndLoginAdmin();
});

test('image details is updated', async () => {
  const createdAt = new Date().toISOString();
  const image = new Image({
    title: 'Sample Image 1 - new details',
    url: 'https://example.com/sample-image.jpg',
    type: 'sample image',
    cloudinaryId: 'sample-cloudinary-id',
    createdAt,
  });
  const newImage = await image.save();
  const newImageId = newImage._id.toString();
  const imageOrder = new ImageOrder();
  imageOrder.order.push(newImage);
  await imageOrder.save();

  const newImageDetails = {
    id: newImageId,
    title: 'Sample Image 1 - new details',
    url: 'https://example.com/sample-image.jpg',
    type: 'sample image',
    cloudinaryId: 'sample-cloudinary-id',
    createdAt,
  };
  const updatedImage = await api
    .put(`/api/images/${newImageId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(newImageDetails);
  expect(updatedImage.body.data).toStrictEqual(newImageDetails);
});
