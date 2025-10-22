import { Router } from 'express';
import { ApplicationController } from '../controllers/applicationController';
import { requireRoles } from '../middleware/authorization';

const router = Router();
const controller = new ApplicationController();

router.get('/', (req, res) => controller.list(req, res));
router.post('/', requireRoles('admin', 'editor'), (req, res) => controller.create(req, res));
router.get('/:id', (req, res) => controller.get(req, res));
router.patch('/:id', requireRoles('admin', 'editor'), (req, res) => controller.update(req, res));
router.delete('/:id', requireRoles('admin'), (req, res) => controller.delete(req, res));

export const applicationRoutes = router;
