const logger = require('./logger');
const jwt = require('jsonwebtoken');

const requestLogger = (req, res, next) => {
  // prevents logging of user information
  if (req.path !== '/auth') {
    logger.info('Method:', req.method);
    logger.info('Path:  ', req.path);
    logger.info('Body:  ', req.body);
    logger.info('---');
  }
  next();
};

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.sendStatus(401);
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log('invalid token', err);
      return res.sendStatus(403); //invalid token
    }
    // Check if the decoded user ID is the admin ID (process.env.ADMIN_ID)
    if (decoded.id !== process.env.ADMIN_ID) {
      return res.sendStatus(401);
    }
    // req.user = decoded.id;
    next();
  });
};

// const tokenExtractor = (req, res, next) => {
//   const authorization = req.get('authorization');
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     req.token = authorization.substring(7);
//   }
//   next();
// };

// const userExtractor = (req, res, next) => {
//   const token = req.token;
//   if (token) {
//     const decodedToken = jwt.verify(token, process.env.SECRET);
//     if (decodedToken.id) {
//       req.user = decodedToken.id;
//     }
//   }
//   next();
// };

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token',
    });
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired',
    });
  }

  next(error);
};

module.exports = {
  requestLogger,
  verifyJWT,
  // tokenExtractor,
  // userExtractor,
  unknownEndpoint,
  errorHandler,
};
