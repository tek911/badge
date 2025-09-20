import { z } from 'zod';

export const BusinessApplicationSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  criticality: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  lifecycleStatus: z.enum(['ACTIVE', 'DEPRECATED', 'SUNSET']),
  tags: z.array(z.record(z.string(), z.any())).default([]),
  primaryCloud: z.enum(['AWS', 'Azure', 'GCP', 'OTHER']),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable().optional(),
});

export type BusinessApplication = z.infer<typeof BusinessApplicationSchema>;
