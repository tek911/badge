import { Router } from 'express';
import { IngestionController } from '../controllers/ingestionController';

const router = Router();
const controller = new IngestionController();

router.post('/ci-event', (req, res) => controller.handleCiEvent(req, res));

export const ingestionRoutes = router;
