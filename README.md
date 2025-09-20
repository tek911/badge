# Service Inventory & Repo-to-Workload Mapper

An enterprise-grade platform for discovering business applications, cataloguing software supply chains, and mapping source repositories to running workloads across clouds and environments.

## Getting Started

```bash
pnpm i && pnpm -w build && docker compose up -d && pnpm -w prisma:migrate && pnpm -w seed && pnpm -w dev
```

The web application is served at [http://localhost:5173](http://localhost:5173) and the API at [http://localhost:3000](http://localhost:3000).

Refer to the documentation under [`docs/`](docs/) for detailed architecture, security guidance, and operational runbooks.
