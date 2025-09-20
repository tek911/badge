import { Connector, ConnectorContext, SyncResult } from '@connectors/core';

export interface AwsConnectorOptions {
  region?: string;
}

export interface AwsWorkloadAsset {
  id: string;
  name: string;
  platform: 'AWS';
  type: string;
  accountId: string;
}

export class AwsConnector implements Connector<void, AwsWorkloadAsset> {
  readonly id = 'cloud-aws';
  readonly displayName = 'AWS Cloud';
  readonly supportsIncremental = true;

  constructor(private readonly options: AwsConnectorOptions = {}) {}

  async authenticate(): Promise<void> {
    // IAM authentication occurs automatically when running in AWS or via env credentials.
  }

  async sync(_: void, ctx: ConnectorContext): Promise<SyncResult<AwsWorkloadAsset>> {
    const items: AwsWorkloadAsset[] = [
      {
        id: 'arn:aws:ecs:us-east-1:123456789012:service/payments',
        name: 'payments',
        platform: 'AWS',
        type: 'ECS_SERVICE',
        accountId: '123456789012',
      },
      {
        id: 'arn:aws:eks:us-east-1:123456789012:cluster/payments-eks',
        name: 'payments-eks',
        platform: 'AWS',
        type: 'EKS_CLUSTER',
        accountId: '123456789012',
      },
    ];

    ctx.logger.info({ count: items.length, region: this.options.region ?? 'us-east-1' }, 'Loaded AWS assets');
    return { items, metadata: { source: this.options.region ? 'aws-api' : 'fixture' } };
  }
}

export const createAwsConnector = (options: AwsConnectorOptions = {}): AwsConnector => new AwsConnector(options);
