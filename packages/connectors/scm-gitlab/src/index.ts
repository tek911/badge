import axios from 'axios';
import { readFile } from 'node:fs/promises';
import { Connector, ConnectorContext, SyncResult } from '@connectors/core';

export interface GitLabConnectorOptions {
  token?: string;
  baseUrl?: string;
}

export interface GitLabProject {
  id: string;
  name: string;
  path: string;
  url: string;
  defaultBranch: string;
  visibility: string;
}

export class GitLabConnector implements Connector<void, GitLabProject> {
  readonly id = 'scm-gitlab';
  readonly displayName = 'GitLab';
  readonly supportsIncremental = true;

  private readonly client = axios.create();

  constructor(private readonly options: GitLabConnectorOptions = {}) {}

  async authenticate(): Promise<void> {
    if (!this.options.token) {
      return;
    }

    this.client.defaults.baseURL = this.options.baseUrl ?? 'https://gitlab.com/api/v4';
    this.client.defaults.headers.common['PRIVATE-TOKEN'] = this.options.token;
  }

  async sync(_: void, ctx: ConnectorContext): Promise<SyncResult<GitLabProject>> {
    if (!this.options.token) {
      const raw = await readFile(new URL('./__fixtures__/projects.json', import.meta.url));
      const data = JSON.parse(raw.toString());
      ctx.logger.info({ count: data.length }, 'Loaded GitLab fixture');
      return {
        items: data.map((project: any) => ({
          id: String(project.id),
          name: project.name,
          path: project.path_with_namespace,
          url: project.web_url,
          defaultBranch: project.default_branch,
          visibility: project.visibility,
        })),
        metadata: { source: 'fixture' },
      };
    }

    const response = await this.client.get('/projects', {
      params: { membership: true, per_page: 100 },
    });

    const items: GitLabProject[] = response.data.map((project: any) => ({
      id: String(project.id),
      name: project.name,
      path: project.path_with_namespace,
      url: project.web_url,
      defaultBranch: project.default_branch,
      visibility: project.visibility,
    }));

    ctx.logger.info({ count: items.length }, 'Fetched GitLab projects');
    return { items, metadata: { source: 'gitlab' } };
  }
}

export const createGitLabConnector = (options: GitLabConnectorOptions = {}): GitLabConnector =>
  new GitLabConnector(options);
