import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH ?? '.env' });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  FRONTEND: z.enum(['react', 'angular']).default('react'),
  HTTP_ENGINE: z.enum(['express', 'fastify']).default('express'),
  OIDC_ISSUER: z.string().default('http://localhost:4000'),
  OIDC_CLIENT_ID: z.string().default('inventory-local'),
  OIDC_CLIENT_SECRET: z.string().default('secret'),
  OIDC_REDIRECT_URI: z.string().default('http://localhost:3000/auth/callback'),
  HMAC_SECRET: z.string().default('local-secret'),
  DEMO_MODE: z.string().default('true'),
  LOG_LEVEL: z.string().default('info'),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);
