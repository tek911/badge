import { z } from 'zod';

export const RepositorySchema = z.object({
  id: z.string(),
  host: z.enum(['github', 'gitlab', 'bitbucket', 'azuredevops']),
  org: z.string(),
  name: z.string(),
  defaultBranch: z.string(),
  url: z.string().url(),
  visibility: z.enum(['public', 'private', 'internal']).default('private'),
  primaryLanguage: z.string(),
  topics: z.array(z.string()).default([]),
  tags: z.array(z.record(z.string(), z.any())).default([]),
  license: z.string().optional(),
});

export type Repository = z.infer<typeof RepositorySchema>;
