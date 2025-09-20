import { z } from 'zod';

export const ComponentSchema = z.object({
  id: z.string(),
  businessApplicationId: z.string(),
  type: z.enum(['FRONTEND', 'BACKEND', 'DATA']),
  name: z.string(),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Component = z.infer<typeof ComponentSchema>;
