import _ from 'lodash';
import { Router, Request, Response } from 'express';
import Post from 'src/models/Post';
import Reply from 'src/models/Reply';
import Reaction, { ReactionTarget, ReactionType } from 'src/models/Reaction';
import { logger, catchAsync } from 'src/utils';
import { authenticateAuthToken } from 'src/middleware/crypto';

const router = Router();

router.put(
  '/post/:postId',
  authenticateAuthToken,
  catchAsync(async (req: Request, res: Response) => {
    logger.log('New reaction to post', req.body);
    const query = { like: 0 };
    if (req.body.target !== ReactionTarget.POST) {
      throw new Error('Wrong reaction type');
    }
    if (req.body.type === ReactionType.LIKE) {
      query.like = 1;
    } else if (req.body.type === ReactionType.UNLIKE) {
      query.like = -1;
    } else {
      throw new Error('Wrong reaction type');
    }
    const post = await Post.findOneAndUpdate({ _id: req.params.postId }, { $inc: query });
    if (!post) {
      throw new Error('Post does not exist');
    }
    const reaction = await Reaction.findOneAndUpdate(
      {
        userId: req.user.id,
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
  authenticateAuthToken,
  catchAsync(async (req: Request, res: Response) => {
    logger.log('New reaction to reply', req.body);
    const query = { like: 0 };
    if (req.body.type === ReactionType.LIKE) {
      query.like = 1;
    } else if (req.body.type === ReactionType.UNLIKE) {
      query.like = -1;
    } else {
      throw new Error('Wrong reaction type');
    }
    const reply = await Reply.findOneAndUpdate({ _id: req.params.replyId }, { $inc: query });
    if (!reply) {
      throw new Error('Reply does not exist');
    }
    const reaction = await Reaction.findOneAndUpdate(
      {
        userId: req.user.id,
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
