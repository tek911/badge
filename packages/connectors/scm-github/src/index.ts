import axios from 'axios';
import { readFile } from 'node:fs/promises';
import { Connector, ConnectorContext, SyncResult } from '@connectors/core';

export interface GitHubConnectorOptions {
  token?: string;
  baseUrl?: string;
}

export interface GitHubRepository {
  id: string;
  name: string;
  org: string;
  url: string;
  defaultBranch: string;
  visibility: string;
  primaryLanguage: string;
  topics: string[];
  license?: string;
}

export class GitHubConnector implements Connector<void, GitHubRepository> {
  readonly id = 'scm-github';
  readonly displayName = 'GitHub';
  readonly supportsIncremental = true;

  private readonly client = axios.create();

  constructor(private readonly options: GitHubConnectorOptions = {}) {}

  async authenticate(): Promise<void> {
    if (!this.options.token) {
      return; // mock mode
    }

    this.client.defaults.baseURL = this.options.baseUrl ?? 'https://api.github.com';
    this.client.defaults.headers.common.Authorization = `Bearer ${this.options.token}`;
  }

  async sync(_: void, ctx: ConnectorContext): Promise<SyncResult<GitHubRepository>> {
    if (!this.options.token) {
      const raw = await readFile(new URL('./__fixtures__/repositories.json', import.meta.url));
      const data = JSON.parse(raw.toString());
      ctx.logger.info({ count: data.length }, 'Loaded GitHub fixture');
      return {
        items: data.map((item: any) => ({
          id: String(item.id),
          name: item.name,
          org: item.org ?? item.owner?.login ?? 'unknown',
          url: item.html_url,
          defaultBranch: item.default_branch,
          visibility: item.visibility,
          primaryLanguage: item.language ?? 'unknown',
          topics: item.topics ?? [],
          license: item.license?.spdx_id ?? undefined,
        })),
        metadata: { source: 'fixture' },
      };
    }

    const response = await this.client.get('/user/repos', {
      params: { per_page: 100, visibility: 'all' },
    });

    const items: GitHubRepository[] = response.data.map((repo: any) => ({
      id: String(repo.id),
      name: repo.name,
      org: repo.owner?.login ?? 'unknown',
      url: repo.html_url,
      defaultBranch: repo.default_branch,
      visibility: repo.visibility,
      primaryLanguage: repo.language ?? 'unknown',
      topics: repo.topics ?? [],
      license: repo.license?.spdx_id ?? undefined,
    }));

    ctx.logger.info({ count: items.length }, 'Fetched GitHub repositories');
    return { items, metadata: { source: 'github' } };
  }
}

export const createGitHubConnector = (options: GitHubConnectorOptions = {}): GitHubConnector =>
  new GitHubConnector(options);
