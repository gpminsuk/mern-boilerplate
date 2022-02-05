import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import jwt_decode from 'jwt-decode';

import User from 'src/models/User';

// Bearer strategy
const bearerLogin = new BearerStrategy(function (token, done) {
  const decoded = jwt_decode(token) as { email: String };
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
