import { Router } from 'express';
import passport from 'passport';
import { Facebook } from 'fb';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import Collection from '../models/Collection';

var fb = new Facebook({});
const router = Router();

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['public_profile', 'email'],
  }),
);

const clientUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/',
    session: false,
  }),
  (req, res) => {
    // console.log(req.user);
    const token = req.user.generateJWT();
    res.cookie('x-auth-cookie', token);
    res.redirect(clientUrl);
  },
);

router.get('/facebook/native', async (req, res) => {
  const fbUser = await fb.withAccessToken(req.query.token).api(`/me?fields=name,id,email,picture.type(large)`);
  let user = await User.findOne({ email: fbUser.email });
  const refreshToken = jwt.sign(
    {
      expiresIn: '48h',
      id: fbUser.id,
      provider: 'facebook',
      email: fbUser.email,
    },
    process.env.JWT_SECRET,
  );
  if (!user) {
    user = await new User({
      facebookId: fbUser.id,
      provider: 'facebook',
      email: fbUser.email,
      name: fbUser.name,
      avatar: fbUser.picture.data.url,
      refreshToken,
    });
    const collection = await Collection.create({
      name: 'My Favorites',
      user: user.id,
      isDefault: true,
    });
    user.defaultCollectionId = collection.id;
    await user.save();
  }
  res.json({ ...user.toJSON(), refreshToken });
});

export default router;
