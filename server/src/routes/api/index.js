import { Router } from 'express';
import postsRoutes from './posts';
import notificationsRoutes from './notifications';
import repliesRoutes from './replies';
const router = Router();

router.use('/posts', postsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/replies', repliesRoutes);

export default router;
