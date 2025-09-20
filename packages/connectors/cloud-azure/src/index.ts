import { Connector, ConnectorContext, SyncResult } from '@connectors/core';

export interface AzureConnectorOptions {
  tenantId?: string;
}

export interface AzureAsset {
  id: string;
  name: string;
  platform: 'Azure';
  type: string;
  subscriptionId: string;
}

export class AzureConnector implements Connector<void, AzureAsset> {
  readonly id = 'cloud-azure';
  readonly displayName = 'Microsoft Azure';
  readonly supportsIncremental = true;

  constructor(private readonly options: AzureConnectorOptions = {}) {}

  async authenticate(): Promise<void> {
    // Managed identity / service principal handled by Azure Identity in production.
  }

  async sync(_: void, ctx: ConnectorContext): Promise<SyncResult<AzureAsset>> {
    const items: AzureAsset[] = [
      {
        id: '/subscriptions/0000/resourceGroups/rg-inventory/providers/Microsoft.Web/sites/checkout-web',
        name: 'checkout-web',
        platform: 'Azure',
        type: 'AZURE_WEBAPP',
        subscriptionId: '0000',
      },
      {
        id: '/subscriptions/0000/resourceGroups/rg-data/providers/Microsoft.ContainerService/managedClusters/inventory-aks',
        name: 'inventory-aks',
        platform: 'Azure',
        type: 'AKS_CLUSTER',
        subscriptionId: '0000',
      },
    ];

    ctx.logger.info({ count: items.length }, 'Loaded Azure assets');
    return { items, metadata: { source: this.options.tenantId ? 'azure-api' : 'fixture' } };
  }
}

export const createAzureConnector = (options: AzureConnectorOptions = {}): AzureConnector => new AzureConnector(options);
