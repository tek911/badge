import axios, { AxiosInstance } from 'axios';
import { z } from 'zod';

const ListApplicationsResponse = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      criticality: z.string(),
      primaryCloud: z.string(),
      tags: z.array(z.record(z.string(), z.any())),
    }),
  ),
  meta: z.object({
    nextCursor: z.string().nullable().optional(),
  }),
});

export type ListApplicationsResponse = z.infer<typeof ListApplicationsResponse>;

export class InventoryClient {
  private readonly http: AxiosInstance;

  constructor(baseURL: string, token?: string) {
    const defaultToken = token ?? 'demo.admin@example.com';
    this.http = axios.create({
      baseURL,
      headers: { Authorization: `Bearer ${defaultToken}` },
    });
  }

  async listApplications(params: Record<string, string | number | undefined> = {}): Promise<ListApplicationsResponse> {
    const response = await this.http.get('/v1/applications', { params });
    return ListApplicationsResponse.parse(response.data);
  }
}
