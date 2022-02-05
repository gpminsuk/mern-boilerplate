import _ from 'lodash';
import { Router, Request, Response } from 'express';
import Reply from 'src/models/Reply';
import { logger, catchAsync } from 'src/utils';
import requireJwtAuth from 'src/middleware/requireJwtAuth';

const router = Router();

router.post(
  '/:postId',
  requireJwtAuth,
  catchAsync(async (req: Request, res: Response) => {
    logger.log('New reply', req.body);
    const reply = await Reply.create({
      userId: req.user._id,
      postId: req.params.postId,
      text: req.body.text,
    });
    res.json(reply.toJSON());
  }),
);

router.get(
  '/:postId',
  catchAsync(async (req: Request, res: Response) => {
    const replies = await Reply.find({
      postId: req.params.postId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);
    res.json(replies.map((reply) => reply.toJSON()));
  }),
);

export default router;
