import { z } from 'zod';

export const createApplicationSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  criticality: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  lifecycleStatus: z.enum(['ACTIVE', 'DEPRECATED', 'SUNSET']).default('ACTIVE'),
  primaryCloud: z.enum(['AWS', 'Azure', 'GCP', 'OTHER']).default('AWS'),
  tags: z.array(z.record(z.string(), z.any())).default([]),
});

export type CreateApplicationDto = z.infer<typeof createApplicationSchema>;

export const updateApplicationSchema = createApplicationSchema.partial();

export type UpdateApplicationDto = z.infer<typeof updateApplicationSchema>;
