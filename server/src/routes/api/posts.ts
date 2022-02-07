import _ from 'lodash';
import { Router, Request, Response } from 'express';
import Post from '../../models/Post';
import { logger, catchAsync } from 'src/utils';
import { authenticateAuthToken } from 'src/middleware/crypto';

const router = Router();

router.post(
  '/',
  authenticateAuthToken,
  catchAsync(async (req: Request, res: Response) => {
    logger.log('New post', req.body);
    const post = await Post.create({
      userId: req.user.id,
      location: [req.body.lng, req.body.lat],
      text: req.body.text,
    });
    res.json(post.toJSON());
  }),
);

router.get(
  '/bypopularity',
  catchAsync(async (req: Request, res: Response) => {
    const posts = await Post.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [req.query.lng, req.query.lat] },
          $minDistance: 0,
          $maxDistance: 500000000000,
        },
      },
    })
      .sort({ like: 'desc', createdAt: 'desc' })
      .limit(20);
    res.json(posts.map((post) => post.toJSON()));
  }),
);

router.get(
  '/bydistance',
  catchAsync(async (req: Request, res: Response) => {
    const posts = await Post.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [req.query.lng, req.query.lat] },
          $minDistance: 0,
          $maxDistance: 500000000000,
        },
      },
    })
      .sort({ createdAt: 'desc' })
      .limit(20);
    res.json(posts.map((post) => post.toJSON()));
  }),
);

router.get(
  '/:postId',
  authenticateAuthToken,
  catchAsync(async (req: Request, res: Response) => {
    const post = await Post.findById(req.params.postId);
    res.json(post.toJSON());
  }),
);

export default router;
