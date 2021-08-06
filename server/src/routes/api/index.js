import { Router } from 'express';
import usersRoutes from './users';
import collectionsRoutes from './collections';
import placesRoutes from './places';
import googleRoutes from './google';
const router = Router();

router.use('/users', usersRoutes);
router.use('/places', placesRoutes);
router.use('/collections', collectionsRoutes);
router.use('/google', googleRoutes);

export default router;
