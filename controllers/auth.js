const authRouter = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
  }),
  (request, response) => {
    const { id, displayName } = request.user;
    // Only allows admin to log in
    // if (id !== process.env.ADMIN_ID)
    //   return response.status(401).json({ error: 'unauthorized user' });
    const user = { id, displayName };
    const token = jwt.sign(
      {
        user,
      },
      process.env.SECRET,
      { expiresIn: 60 * 60 }
    );

    response.cookie('jwtPortfolioApp', token, {
      secure: true,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 1000,
      domain: 'takashi-photos.onrender.com',
    });
    response.status(200).redirect(process.env.CLIENT_URL);
  }
);

module.exports = authRouter;
