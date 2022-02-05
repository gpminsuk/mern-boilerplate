import _ from 'lodash';
import { Router, Request, Response } from 'express';
import Post from '../../models/Post';
import { logger, catchAsync } from 'src/utils';
import requireJwtAuth from 'src/middleware/requireJwtAuth';

const router = Router();

router.post(
  '/',
  requireJwtAuth,
  catchAsync(async (req: Request, res: Response) => {
    logger.log('New post', req.body);
    const post = await Post.create({
      userId: req.user._id,
      location: [1, 1],
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
          $geometry: { type: 'Point', coordinates: [req.query.lat, req.query.lng] },
          $minDistance: 0,
          $maxDistance: 5000,
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
          $geometry: { type: 'Point', coordinates: [req.query.lat, req.query.lng] },
          $minDistance: 0,
          $maxDistance: 5000,
        },
      },
    })
      .sort({ createdAt: 'desc' })
      .limit(20);
    res.json(posts.map((post) => post.toJSON()));
  }),
);

export default router;
