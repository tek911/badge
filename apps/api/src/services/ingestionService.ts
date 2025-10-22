import { OwnerType } from '@prisma/client';
import crypto from 'node:crypto';
import { env } from '../config/env';
import { ingestionEventsCounter } from '../observability/metrics';
import { prisma } from '../utils/prisma';

export interface CiDeploymentEvent {
  repo: string;
  commit: string;
  image: string;
  environment: string;
  serviceName: string;
  labels?: Record<string, string>;
  timestamp: string;
}

async function resolveSystemActorId(): Promise<string> {
  const owner = await prisma.owner.upsert({
    where: { email: 'system@inventory.local' },
    update: {},
    create: {
      email: 'system@inventory.local',
      name: 'System',
      type: OwnerType.TECHNICAL,
    },
  });
  return owner.id;
}

export class IngestionService {
  verifySignature(payload: string, signatureHeader: string | undefined): void {
    if (!signatureHeader) {
      throw Object.assign(new Error('Missing signature header'), { status: 401 });
    }
    const [algorithm, signature] = signatureHeader.split('=');
    if (algorithm !== 'sha256') {
      throw Object.assign(new Error('Unsupported signature algorithm'), { status: 400 });
    }
    const expected = crypto.createHmac('sha256', env.HMAC_SECRET).update(payload).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      throw Object.assign(new Error('Invalid signature'), { status: 403 });
    }
  }

  async recordDeployment(event: CiDeploymentEvent) {
    ingestionEventsCounter.inc({ source: 'ci' });
    const actorId = await resolveSystemActorId();
    await prisma.auditLog.create({
      data: {
        actorId,
        action: 'ci_event',
        entityType: 'deployment',
        entityId: event.serviceName,
        details: event,
        hash: crypto.createHash('sha256').update(JSON.stringify(event)).digest('hex'),
      },
    });
  }
}
