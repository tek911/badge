# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/web/package.json apps/web/
COPY packages ./packages
RUN corepack enable pnpm
RUN pnpm fetch
COPY . .
RUN pnpm --filter web install --offline
RUN pnpm --filter web build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/apps/web/dist ./dist
COPY --from=builder /app/apps/web/package.json ./package.json
RUN corepack enable pnpm && pnpm install --prod
CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "4173"]
