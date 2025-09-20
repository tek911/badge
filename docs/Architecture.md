# Architecture Overview

```mermaid
graph TD
  subgraph Web[apps/web]
    UI[React + Mantine UI]
    UI --> SDK
  end

  subgraph API[apps/api]
    Controller --> Service --> Repository
    Service --> Domain[(Domain Models)]
    Repository --> Prisma[(PostgreSQL)]
    Repository --> Redis[(Redis Cache)]
    Service --> Connectors
  end

  subgraph Connectors[packages/connectors]
    GitHub[GitHub]
    GitLab[GitLab]
    AWS[AWS]
    Azure[Azure]
    GCP[GCP]
    Kube[Kubernetes]
    Wiz[Wiz CNAPP]
  end

  subgraph Workers[packages/workers]
    Ingestion
    Reconciliation
    Sbom
  end

  SDK[Typed SDK]
  UI -->|TanStack Query| API
  API --> Workers
  Workers --> Connectors
  Connectors --> API
```

The platform follows 12-factor app principles with a clean architecture approach:

- **Presentation layer**: React SPA communicating with the API via the generated SDK.
- **Application layer**: Express-based services orchestrating use-cases and cross-cutting concerns.
- **Domain layer**: Rich TypeScript entities/value objects shared between the API and background workers.
- **Infrastructure layer**: Prisma repositories, connector adapters, and external integrations (SCM, CI/CD, cloud providers, CNAPP).

Key quality attributes include security-first design, observability (logs, metrics, traces), and modular connector interfaces for pluggability.
