import _ from 'lodash';
import { Router, Request, Response } from 'express';
import Post from 'src/models/Post';
import Reply from 'src/models/Reply';
import Reaction, { ReactionTarget, ReactionType } from 'src/models/Reaction';
import ReactionHistory from 'src/models/ReactionHistory';
import { logger, catchAsync } from 'src/utils';
import { authenticateAuthToken } from 'src/middleware/crypto';

const router = Router();

router.put(
  '/post/:postId',
  authenticateAuthToken,
  catchAsync(async (req: Request, res: Response) => {
    logger.log('New reaction to post', req.body);
    if (req.body.target !== ReactionTarget.POST) {
      throw new Error('Wrong reaction target');
    }
    const reaction = await Reaction.findOneAndUpdate(
      { userId: req.user.id, target: ReactionTarget.POST, targetId: req.params.postId },
      { $set: { type: req.body.type } },
      { upsert: true, new: true },
    );
    await ReactionHistory.create(_.omit(reaction, ['_id']));
    const post = await Post.findById(req.params.postId);
    res.json(await post.toJSON());
  }),
);

router.put(
  '/reply/:replyId',
  authenticateAuthToken,
  catchAsync(async (req: Request, res: Response) => {
    logger.log('New reaction to reply', req.body);
    if (req.body.target !== ReactionTarget.REPLY) {
      throw new Error('Wrong reaction target');
    }
    const reaction = await Reaction.findOneAndUpdate(
      { userId: req.user.id, target: ReactionTarget.REPLY, targetId: req.params.replyId },
      { $set: { type: req.body.type } },
      { upsert: true, new: true },
    );
    await ReactionHistory.create(_.omit(reaction, ['_id']));
    const reply = await Reply.findById(req.params.replyId);
    res.json(await reply.toJSON());
  }),
);

export default router;
