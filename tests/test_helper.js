const ImageOrder = require('../models/ImageOrder');
const Image = require('../models/Image');
const bcrypt = require('bcrypt');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const config = require('../utils/config');
const User = require('../models/User');
const mongoose = require('mongoose');

const sampleImages = [
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
  {
    title: 'Sample Image 3',
    url: 'https://example.com/sample-image-3.jpg',
    type: 'jpg',
    cloudinaryId: 'sample-cloudinary-id-4',
    createdAt: new Date(),
  },
];

const createNewImageOrder = async () => {
  const imageOrder = new ImageOrder();
  await imageOrder.save();
  return imageOrder;
};

const createAndLoginAdmin = async () => {
  await mongoose.connect(config.MONGODB_URI);
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash('password', saltRounds);
  const user = new User({
    email: 'admin@admin.com',
    passwordHash,
    role: 'admin',
  });
  await user.save();
  const admin = { email: 'admin@admin.com', password: 'password' };
  const res = await api.post('/auth').send(admin);
  return res.body;
};

module.exports = {
  sampleImages,
  createNewImageOrder,
  createAndLoginAdmin,
};
