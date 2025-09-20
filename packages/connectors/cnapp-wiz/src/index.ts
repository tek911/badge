import { readFile } from 'node:fs/promises';
import { Connector, ConnectorContext, SyncResult } from '@connectors/core';

export interface WizConnectorOptions {
  baseUrl?: string;
  token?: string;
}

export interface WizAsset {
  id: string;
  name: string;
  platform: string;
  type: string;
  tags: Record<string, string>;
}

export class WizConnector implements Connector<void, WizAsset> {
  readonly id = 'cnapp-wiz';
  readonly displayName = 'Wiz CNAPP';
  readonly supportsIncremental = true;

  constructor(private readonly options: WizConnectorOptions = {}) {}

  async authenticate(): Promise<void> {
    // Token validation would occur here for real API usage.
  }

  async sync(_: void, ctx: ConnectorContext): Promise<SyncResult<WizAsset>> {
    if (!this.options.token) {
      const raw = await readFile(new URL('./__fixtures__/assets.json', import.meta.url));
      const data = JSON.parse(raw.toString()) as WizAsset[];
      ctx.logger.info({ count: data.length }, 'Loaded Wiz fixture');
      return { items: data, metadata: { source: 'fixture' } };
    }

    // Real API call stubbed for brevity.
    ctx.logger.warn('Wiz API integration not fully implemented in demo mode');
    return { items: [], metadata: { source: 'api' } };
  }
}

export const createWizConnector = (options: WizConnectorOptions = {}): WizConnector => new WizConnector(options);
