import { Router } from 'express';
import { applicationRoutes } from './applicationRoutes';
import { ingestionRoutes } from './ingestionRoutes';

const router = Router();

router.use('/applications', applicationRoutes);
router.use('/ingest', ingestionRoutes);

export const apiRoutes = router;
