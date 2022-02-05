import { Router } from 'express';
import usersRoutes from './users';
import postsRoutes from './posts';
import notificationsRoutes from './notifications';
import repliesRoutes from './replies';
import reactionsRoutes from './reactions';

const router = Router();

router.use('/users', usersRoutes);
router.use('/posts', postsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/replies', repliesRoutes);
router.use('/reactions', reactionsRoutes);

export default router;
