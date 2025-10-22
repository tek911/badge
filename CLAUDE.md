# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a monorepo managed with pnpm workspaces. Use these commands from the root:

### Core Development
- `pnpm i` - Install dependencies
- `pnpm -w build` - Build all packages and apps
- `pnpm -w dev` - Start development servers for all apps in parallel
- `pnpm -w lint` - Lint all packages
- `pnpm -w test` - Run tests across all packages
- `pnpm -w typecheck` - Type check all TypeScript code
- `pnpm -w format` - Format code with Prettier

### Database Operations
- `pnpm -w prisma:migrate` - Deploy database migrations
- `pnpm -w prisma:generate` - Generate Prisma client
- `pnpm -w seed` - Seed database with test data

### Individual App Commands
- API: `pnpm --filter api <command>` (dev, build, test, lint, typecheck)
- Web: `pnpm --filter web <command>` (dev, build, test, lint, typecheck)

### Getting Started
```bash
pnpm i && pnpm -w build && docker compose up -d && pnpm -w prisma:migrate && pnpm -w seed && pnpm -w dev
```

## Architecture

This is a service inventory platform with clean architecture:

### Apps Structure
- `apps/api/` - Express.js REST API with Prisma ORM
- `apps/web/` - React SPA with Mantine UI and TanStack Query

### Packages Structure
- `packages/domain/` - Shared domain entities and value objects
- `packages/shared/` - SDK and utilities used by both frontend and backend
- `packages/connectors/` - Pluggable connector framework for external integrations
  - `core/` - Base connector interfaces and types
  - `cloud-{aws,azure,gcp}/` - Cloud provider connectors
  - `scm-{github,gitlab}/` - Source control management connectors
  - `cnapp-wiz/` - Security platform connector
  - `kube/` - Kubernetes connector
- `packages/workers/` - Background job processors

### Key Design Patterns
- Clean architecture with domain entities isolated from infrastructure
- Connector pattern for external integrations with common interface
- Dependency injection using TSyringe in the API
- Shared TypeScript paths configured in `tsconfig.base.json`

### Technology Stack
- **Backend**: Express.js, Prisma, PostgreSQL, Redis, BullMQ
- **Frontend**: React, Mantine UI, TanStack Query, Vite
- **Testing**: Jest (API), Vitest (Web), Playwright (E2E)
- **Observability**: Pino logging, Prometheus metrics

## Database Schema

The platform uses PostgreSQL with Prisma ORM. Key entities:
- BusinessApplication - Top-level business applications
- Component - Software components within applications
- Repository - Source code repositories
- Workload - Running instances (containers, services)
- Various linking tables for relationships and reconciliation

Schema is located at `apps/api/prisma/schema.prisma`.

## Connector Framework

Connectors implement the `Connector` interface from `@connectors/core` and provide:
- Authentication mechanisms
- Idempotent sync operations
- Structured domain entity output
- Incremental sync capabilities where supported

Each connector can ingest repositories, workloads, or asset metadata from external systems.

## Path Aliases

The monorepo uses TypeScript path mapping for clean imports:
- `@domain/*` - Domain entities from `packages/domain/src/*`
- `@shared/sdk` - Shared SDK from `packages/shared/src/index.ts`
- `@connectors/*` - Connector packages from `packages/connectors/*/src/index.ts`
- `@workers/*` - Worker utilities from `packages/workers/src/*`

## Code Quality

- ESLint configuration in `eslint.config.js` with TypeScript and Prettier integration
- Husky git hooks with lint-staged for pre-commit linting
- Conventional commits enforced via commitlint
- No console.log allowed (use logger instead)

## Testing Strategy

- Unit tests: Jest for API, Vitest for Web
- Integration tests: Supertest for API endpoints
- E2E tests: Playwright for critical user flows
- Fixtures available in connector `__fixtures__/` directories for offline development