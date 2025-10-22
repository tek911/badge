import { Queue, Worker, Job } from 'bullmq';
import { createAwsConnector } from '@connectors/cloud-aws';
import { createAzureConnector } from '@connectors/cloud-azure';
import { createGcpConnector } from '@connectors/cloud-gcp';
import { createGitHubConnector } from '@connectors/scm-github';
import { createGitLabConnector } from '@connectors/scm-gitlab';
import { createKubernetesConnector } from '@connectors/kube';
import { createWizConnector } from '@connectors/cnapp-wiz';
import type { Connector } from '@connectors/core';
import pino from 'pino';

const logger = pino({ name: 'workers', level: process.env.LOG_LEVEL ?? 'info' });

export type JobType = 'sync:github' | 'sync:gitlab' | 'sync:aws' | 'sync:azure' | 'sync:gcp' | 'sync:kubernetes' | 'sync:wiz';

export interface SyncJobData {
  connectorOptions?: Record<string, unknown>;
}

function resolveConnector(type: JobType): Connector<any, any> {
  switch (type) {
    case 'sync:github':
      return createGitHubConnector({ token: process.env.GITHUB_TOKEN });
    case 'sync:gitlab':
      return createGitLabConnector({ token: process.env.GITLAB_TOKEN, baseUrl: process.env.GITLAB_BASE_URL });
    case 'sync:aws':
      return createAwsConnector({ region: process.env.AWS_REGION });
    case 'sync:azure':
      return createAzureConnector({ tenantId: process.env.AZURE_TENANT_ID });
    case 'sync:gcp':
      return createGcpConnector({ projectId: process.env.GCP_PROJECT_ID });
    case 'sync:kubernetes':
      return createKubernetesConnector({ kubeconfigPath: process.env.KUBECONFIG });
    case 'sync:wiz':
      return createWizConnector({ baseUrl: process.env.WIZ_BASE_URL, token: process.env.WIZ_TOKEN });
    default:
      throw new Error(`Unsupported connector type: ${type}`);
  }
}

export function createSyncWorker(connection: { connection: any }) {
  return new Worker<JobType, unknown, JobType>('sync-jobs', async (job: Job<SyncJobData, unknown, JobType>) => {
    const connector = resolveConnector(job.name as JobType);
    await connector.authenticate();
    const result = await connector.sync(undefined, {
      logger,
      metrics: {
        increment: () => undefined,
        observe: () => undefined,
      },
      cache: {
        get: async () => null,
        set: async () => undefined,
      },
    });
    logger.info({ jobId: job.id, connector: connector.id, items: result.items.length }, 'Sync complete');
    return result.metadata;
  }, connection);
}

export function createSyncQueue(connection: { connection: any }) {
  return new Queue<JobType>('sync-jobs', connection);
}
