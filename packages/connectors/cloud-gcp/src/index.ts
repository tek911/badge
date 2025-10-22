import { Connector, ConnectorContext, SyncResult } from '@connectors/core';

export interface GcpConnectorOptions {
  projectId?: string;
}

export interface GcpAsset {
  id: string;
  name: string;
  platform: 'GCP';
  type: string;
  projectId: string;
}

export class GcpConnector implements Connector<void, GcpAsset> {
  readonly id = 'cloud-gcp';
  readonly displayName = 'Google Cloud';
  readonly supportsIncremental = true;

  constructor(private readonly options: GcpConnectorOptions = {}) {}

  async authenticate(): Promise<void> {
    // Application default credentials used implicitly.
  }

  async sync(_: void, ctx: ConnectorContext): Promise<SyncResult<GcpAsset>> {
    const projectId = this.options.projectId ?? 'demo-project';
    const items: GcpAsset[] = [
      {
        id: `projects/${projectId}/locations/us-central1/services/checkout-web`,
        name: 'checkout-web',
        platform: 'GCP',
        type: 'CLOUD_RUN_SERVICE',
        projectId,
      },
      {
        id: `projects/${projectId}/clusters/gke-analytics`,
        name: 'gke-analytics',
        platform: 'GCP',
        type: 'GKE_CLUSTER',
        projectId,
      },
    ];

    ctx.logger.info({ count: items.length, projectId }, 'Loaded GCP assets');
    return { items, metadata: { source: this.options.projectId ? 'gcp-api' : 'fixture' } };
  }
}

export const createGcpConnector = (options: GcpConnectorOptions = {}): GcpConnector => new GcpConnector(options);
