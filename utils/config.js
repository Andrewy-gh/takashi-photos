require('dotenv').config();
const Config = require('../models/Config');
const ImageOrder = require('../models/ImageOrder');

const PORT = process.env.PORT;

const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

let appInitialized = false;

const initializeApp = async () => {
  const existingConfig = await Config.findOne();
  if (!appInitialized && !existingConfig) {
    const newConfig = new Config({
      adminCreated: false,
    });
    await newConfig.save();
    const imageOrder = new ImageOrder({});
    await imageOrder.save();
  }
  appInitialized = true;
};

module.exports = {
  MONGODB_URI,
  PORT,
  initializeApp,
};
