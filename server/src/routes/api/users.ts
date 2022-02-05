import _ from 'lodash';
import moment from 'moment';
import { Router, Request, Response } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import User from 'src/models/User';
import { logger, catchAsync } from 'src/utils';

const router = Router();

router.put(
  '/',
  catchAsync(async (req: Request, res: Response) => {
    const user = await User.findOneAndUpdate(
      { phone: req.body.phone },
      { $set: _.pick(req.body, ['name']) },
      { upsert: true },
    );
    if (user.verified) {
      res.status(200).json({ user: user.toJSON() });
    } else {
      res.status(403).json({});
    }
  }),
);

router.get(
  '/verify',
  catchAsync(async (req: Request, res: Response) => {
    const verificationCode = '1234';
    const user = await User.findOneAndUpdate(
      { phone: req.body.phone },
      { $set: { verificationCode, verificationExpireAt: moment().add(5, 'minutes') } },
    );
    if (user.verified) {
      res.status(200).json({ user: user.toJSON() });
    } else {
      res.status(200).json({ verificationCode });
    }
  }),
);

router.put(
  '/verify',
  catchAsync(async (req: Request, res: Response) => {
    const user = await User.findOneAndUpdate(
      { phone: req.body.phone, verificationCode: req.body.verificationCode, verificationExpireAt: { $gt: new Date() } },
      { $set: { verified: true } },
    );
    if (user) {
      res.status(200).json({ user: user.toJSON() });
    } else {
      res.status(403).json({});
    }
  }),
);

router.get(
  '/me',
  requireJwtAuth,
  catchAsync(async (req: Request, res: Response) => {
    const me = req.user.toJSON();
    res.json({ me });
  }),
);

export default router;
