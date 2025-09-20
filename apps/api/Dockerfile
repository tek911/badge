# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/
COPY packages ./packages
RUN corepack enable pnpm
RUN pnpm fetch
COPY . .
RUN pnpm --filter api install --offline
RUN pnpm --filter api build

FROM node:20-alpine
WORKDIR /app
COPY --from=base /app/apps/api/dist ./dist
COPY --from=base /app/apps/api/package.json ./package.json
RUN corepack enable pnpm && pnpm install --prod
CMD ["node", "dist/index.js"]
