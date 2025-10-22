# Data Model

The domain is persisted via PostgreSQL using Prisma. Entities are structured to support soft deletion, auditability, and provenance of reconciled links.

```mermaid
erDiagram
  BusinessApplication ||--o{ Component : contains
  BusinessApplication ||--o{ ApplicationOwner : "has"
  Owner ||--o{ ApplicationOwner : "assigned"
  Component ||--o{ RepoComponentLink : "references"
  Component ||--o{ LibraryDependency : "uses"
  Component ||--o{ ComponentToWorkload : "runs on"
  Repository ||--o{ RepoComponentLink : "linked"
  ContainerImage ||--o{ ImageToWorkload : "deployed"
  Workload ||--o{ ImageToWorkload : "uses"
  Workload ||--o{ ComponentToWorkload : "hosts"
  BusinessApplication ||--o{ Tag : "tagged"
  AuditLog }o--|| Owner : "actor"
```

See [`apps/api/prisma/schema.prisma`](../apps/api/prisma/schema.prisma) for the authoritative schema and field-level documentation.
