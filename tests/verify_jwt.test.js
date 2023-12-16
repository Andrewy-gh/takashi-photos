const jwt = require('jsonwebtoken');
const { verifyJWT } = require('../utils/middleware');
const AppError = require('../utils/AppError');
const User = require('../models/User');
const { createUserAndLogin } = require('./test_helper');

test('returns 401 if no authorization header', async () => {
  const req = {};
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  expect(verifyJWT(req, res, next)).rejects.toThrow(AppError);
});

test('calls next if valid JWT', async () => {
  await User.deleteMany({});
  const token = await createUserAndLogin('admin');
  const req = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const res = {};
  const next = jest.fn();

  await verifyJWT(req, res, next);

  expect(next).toHaveBeenCalled();
});

test('returns error if user not admin', async () => {
  await User.deleteMany({});
  const token = await createUserAndLogin('not-admin');
  const req = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const res = {};
  const next = jest.fn();

  expect(verifyJWT(req, res, next)).rejects.toThrow(AppError);
});
