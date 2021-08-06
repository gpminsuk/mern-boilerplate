import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import jwt_decode from 'jwt-decode';

import User from '../models/User';

const isProduction = process.env.NODE_ENV === 'production';
const secretOrKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;

// Bearer strategy
const bearerLogin = new BearerStrategy(function (token, done) {
  const decoded = jwt_decode(token);
  User.findOne({ email: decoded.email }, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    return done(null, user, { scope: 'all' });
  });
});

passport.use(bearerLogin);
