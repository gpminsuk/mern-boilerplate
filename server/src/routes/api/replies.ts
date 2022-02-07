import _ from 'lodash';
import { Router, Request, Response } from 'express';
import Reply from 'src/models/Reply';
import { logger, catchAsync } from 'src/utils';
import { authenticateAuthToken } from 'src/middleware/crypto';

const router = Router();

router.post(
  '/:postId',
  authenticateAuthToken,
  catchAsync(async (req: Request, res: Response) => {
    logger.log('New reply', req.body);
    const reply = await Reply.create({
      userId: req.user.id,
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
