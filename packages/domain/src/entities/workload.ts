import { z } from 'zod';

export const WorkloadSchema = z.object({
  id: z.string(),
  type: z.enum(['CLOUD_SERVICE', 'CONTAINER', 'VM']),
  platform: z.enum(['AWS', 'Azure', 'GCP', 'K8S', 'VMWARE', 'OTHER']),
  name: z.string(),
  region: z.string().nullable().optional(),
  accountId: z.string().nullable().optional(),
  cluster: z.string().nullable().optional(),
  namespace: z.string().nullable().optional(),
  serviceType: z.string().nullable().optional(),
  runtimeTags: z.record(z.string(), z.unknown()).default({}),
  url: z.string().url().optional(),
  status: z.string(),
});

export type Workload = z.infer<typeof WorkloadSchema>;
