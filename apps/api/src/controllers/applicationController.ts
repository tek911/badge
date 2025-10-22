import type { Request, Response } from 'express';
import { createApplicationSchema, updateApplicationSchema } from '../validators/applicationValidators';
import { ApplicationService } from '../services/applicationService';

const service = new ApplicationService();

export class ApplicationController {
  async list(req: Request, res: Response) {
    const { data, meta } = await service.listApplications({
      size: req.query['page[size]'] ? Number(req.query['page[size]']) : undefined,
      after: req.query['page[after]'] ? String(req.query['page[after]']) : undefined,
      owner: req.query['filter[owner]'] ? String(req.query['filter[owner]']) : undefined,
      tag: req.query['filter[tag]'] ? String(req.query['filter[tag]']) : undefined,
    });
    res.set('ETag', `W/"applications-${meta.nextCursor ?? 'end'}"`);
    res.json({ data, meta });
  }

  async get(req: Request, res: Response) {
    const application = await service.getApplication(req.params.id);
    if (!application) {
      res.status(404).json({ type: 'about:blank', title: 'Not Found', status: 404 });
      return;
    }
    res.json({ data: application });
  }

  async create(req: Request, res: Response) {
    const dto = createApplicationSchema.parse(req.body);
    const application = await service.createApplication(dto);
    res.status(201).json({ data: application });
  }

  async update(req: Request, res: Response) {
    const dto = updateApplicationSchema.parse(req.body);
    const application = await service.updateApplication(req.params.id, dto);
    res.json({ data: application });
  }

  async delete(req: Request, res: Response) {
    await service.deleteApplication(req.params.id);
    res.status(204).send();
  }
}
