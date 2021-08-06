import passport from 'passport';

const requireJwtAuth = passport.authenticate('bearer', { session: false });

export default requireJwtAuth;
