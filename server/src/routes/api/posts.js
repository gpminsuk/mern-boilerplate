import _ from 'lodash';
import fetch from 'node-fetch';
import { Router } from 'express';
import Post from '../../models/Post';

const router = Router();

router.get('/bypopularity', async (req, res) => {
  try {
    const posts = await Post.find({
      location: {
        $near: {
          $geometry: { type: "Point",  coordinates: [ req.params.lat, req.params.lng ] },
          $minDistance: 0,
          $maxDistance: 5000,
        }
      }
    })
      .sort({ like: 'desc', createdAt: 'desc' })
      .limit(20);
    res.json(posts.map((post) => post.toJSON()));
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/bydistance', async (req, res) => {
  try {
    const posts = await Post.find({
      location: {
        $near: {
          $geometry: { type: "Point",  coordinates: [ req.params.lat, req.params.lng ] },
          $minDistance: 0,
          $maxDistance: 5000,
        }
      }
    })
      .sort({ createdAt: 'desc' })
      .limit(20);
    res.json(posts.map((post) => post.toJSON()));
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
