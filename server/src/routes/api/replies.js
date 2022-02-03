import _ from 'lodash';
import fetch from 'node-fetch';
import { Router } from 'express';
import Reply from '../../models/Reply';

const router = Router();

router.get('/:postId', async (req, res) => {
  try {
    const replies = await Reply.find({
      postId: req.params.postId
    })
      .sort({ createdAt: 'desc' })
      .limit(20);
    res.json(replies.map((reply) => reply.toJSON()));
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
