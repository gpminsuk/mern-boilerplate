import _ from 'lodash';
import { Router, Request, Response } from 'express';
import Post from 'src/models/Post';
import Reply from 'src/models/Reply';
import Reaction from 'src/models/Reaction';
import { logger, catchAsync } from 'src/utils';
import requireJwtAuth from 'src/middleware/requireJwtAuth';

const router = Router();

router.put(
  '/post/:postId',
  requireJwtAuth,
  catchAsync(async (req: Request, res: Response) => {
    logger.log('New reaction to post', req.body);
    const post = await Post.findById(req.params.postId);
    if (!post) {
      throw new Error('Post does not exist');
    }
    const reaction = await Reaction.findOneAndUpdate(
      {
        userId: req.user._id,
        postId: req.params.postId,
      },
      {
        $set: {
          type: req.body.type,
        },
      },
      { upsert: true },
    );
    res.json(reaction.toJSON());
  }),
);

router.put(
  '/reply/:replyId',
  requireJwtAuth,
  catchAsync(async (req: Request, res: Response) => {
    logger.log('New reaction to reply', req.body);
    const reply = await Reply.findById(req.params.replyId);
    if (!reply) {
      throw new Error('Reply does not exist');
    }
    const reaction = await Reaction.findOneAndUpdate(
      {
        userId: req.user._id,
        replyId: req.params.replyId,
      },
      {
        $set: {
          type: req.body.type,
        },
      },
      { upsert: true },
    );
    res.json(reaction.toJSON());
  }),
);

export default router;
