import { Router } from 'express';
import usersRoutes from './users';
import collectionsRoutes from './collections';
import placesRoutes from './places';
const router = Router();

router.use('/users', usersRoutes);
router.use('/places', placesRoutes);
router.use('/collections', collectionsRoutes);

export default router;
