import { Router, Request, Response } from 'express';
import apiRoutes from './api';
const router = Router();

router.use('/api', apiRoutes);
// fallback 404
router.use('/api', (req: Request, res: Response) => res.status(404).json('No route for this path'));

export default router;
