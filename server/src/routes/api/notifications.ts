import _ from 'lodash';
import bluebird from 'bluebird';
import { Router, Request, Response } from 'express';
import Notification from 'src/models/Notification';
import { logger, catchAsync } from 'src/utils';
import { authenticateAuthToken } from 'src/middleware/crypto';

const router = Router();

router.get(
  '/',
  authenticateAuthToken,
  catchAsync(async (req: Request, res: Response) => {
    const notifications = await Notification.find({
      userId: req.user.id,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);
    res.json(await bluebird.map(notifications, async (notification) => notification.toJSON()));
  }),
);

export default router;
