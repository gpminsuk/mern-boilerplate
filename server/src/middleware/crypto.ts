import jwt from 'express-jwt';
import { Request, Response, NextFunction } from 'express';
import User from 'src/models/User';

export const SECRET_REFRESH_TOKEN = 'SECRET';
export const SECRET_AUTH_TOKEN = 'SECRET';
export const AUTH_TOKEN_EXPIRY = 3; //60 * 60 * 24;

export const authenticateAuthToken = [
  jwt({
    secret: SECRET_AUTH_TOKEN,
    algorithms: ['HS256'],
    credentialsRequired: false,
  }),
  async (req: Request, _res: Response, next: NextFunction) => {
    if (req.user) {
      req.user = await User.findOne({ phone: req.user.phone });
    }
    next();
  },
];
export const authenticateRefreshToken = jwt({ secret: SECRET_REFRESH_TOKEN, algorithms: ['HS256'] });
