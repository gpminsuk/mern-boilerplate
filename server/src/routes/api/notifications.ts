import _ from 'lodash';
import { Router, Request, Response } from 'express';
import Notification from 'src/models/Notification';
import { logger, catchAsync } from 'src/utils';

const router = Router();

router.get(
  '/',
  catchAsync(async (req: Request, res: Response) => {
    const notifications = await Notification.find({
      userId: req.user.id,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);
    res.json(notifications.map((notification) => notification.toJSON()));
  }),
);

export default router;
