# Connector Framework

Connectors implement the `Connector` interface from `@connectors/core` and are resolved via dependency injection. Each connector declares capabilities (ingest repositories, workloads, tags) and exposes idempotent `sync` methods.

```ts
export interface ConnectorContext {
  readonly logger: Logger;
  readonly metrics: MetricsCollector;
  readonly cache: CacheClient;
}

export interface SyncResult<T> {
  readonly items: T[];
  readonly metadata: Record<string, unknown>;
}

export interface Connector<TInput = void, TResult = unknown> {
  readonly id: string;
  readonly displayName: string;
  readonly supportsIncremental: boolean;
  authenticate(): Promise<void>;
  sync(input: TInput, ctx: ConnectorContext): Promise<SyncResult<TResult>>;
}
```

## Adding a New Provider

1. Create a new package under `packages/connectors/<provider>`.
2. Implement the connector class and export it via the package entrypoint.
3. Add configuration to `apps/api` to register the connector when the relevant feature flag or environment variable is set.
4. Provide fixtures/mocks under `__fixtures__` for offline development.
5. Document the environment variables and permissions in `docs/Connectors.md`.

## Existing Connectors

| Connector | Capabilities | Notes |
|-----------|--------------|-------|
| GitHub | Repositories, manifests, SBoM ingestion | Supports GitHub App and PAT authentication |
| GitLab | Repositories, pipeline metadata | Self-managed supported via `GITLAB_BASE_URL` |
| AWS | Workloads (ECR, ECS, EKS, Lambda), tags | Uses AWS SDK v3 and IAM roles |
| Azure | Workloads (ACR, AKS, App Services), tags | Azure Identity for auth |
| GCP | Artifact Registry, Cloud Run, GKE, labels | Workload Identity Federation ready |
| Kubernetes | Cluster workloads (Deployments, Pods) | Requires `KUBECONFIG` or in-cluster service account |
| Wiz | CNAPP asset inventory | Mock provider available when `WIZ_TOKEN` missing |

Each connector emits structured domain entities enriched with provenance metadata consumed by the reconciliation workers.
