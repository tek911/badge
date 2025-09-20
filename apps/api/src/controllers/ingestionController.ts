import type { Request, Response } from 'express';
import { IngestionService } from '../services/ingestionService';
import { z } from 'zod';

const service = new IngestionService();

const deploymentSchema = z.object({
  repo: z.string(),
  commit: z.string(),
  image: z.string(),
  environment: z.string(),
  serviceName: z.string(),
  labels: z.record(z.string(), z.string()).optional(),
  timestamp: z.string().datetime({ offset: true }),
});

export class IngestionController {
  async handleCiEvent(req: Request, res: Response) {
    const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    service.verifySignature(payload, req.headers['x-signature'] as string | undefined);
    const event = deploymentSchema.parse(JSON.parse(payload));
    await service.recordDeployment(event);
    res.status(202).json({ status: 'accepted' });
  }
}
