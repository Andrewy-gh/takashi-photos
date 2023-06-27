const loginRouter = require('express').Router();

loginRouter.get('/', (req, res) => {
  res.status(200).json({ url: process.env.CALLBACK_URL });
});

module.exports = loginRouter;
