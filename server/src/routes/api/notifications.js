import _ from 'lodash';
import fetch from 'node-fetch';
import { Router } from 'express';
import Notification from '../../models/Notification';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.id
    })
      .sort({ createdAt: 'desc' })
      .limit(20);
    res.json(notifications.map((notification) => notification.toJSON()));
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
