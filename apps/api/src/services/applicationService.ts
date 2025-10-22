import { prisma } from '../utils/prisma';
import type { CreateApplicationDto, UpdateApplicationDto } from '../validators/applicationValidators';
const DEFAULT_PAGE_SIZE = 25;

function normalizePagination(query: { size?: number; after?: string }) {
  const size = Math.min(Math.max(query.size ?? DEFAULT_PAGE_SIZE, 1), 100);
  return { size, after: query.after ?? '' };
}

export class ApplicationService {
  async listApplications(query: { size?: number; after?: string; owner?: string; tag?: string }) {
    const pagination = normalizePagination(query);
    const applications = await prisma.businessApplication.findMany({
      take: pagination.size,
      skip: pagination.after ? 1 : 0,
      cursor: pagination.after ? { id: pagination.after } : undefined,
      orderBy: { createdAt: 'asc' },
      include: {
        components: true,
        owners: {
          include: { owner: true },
        },
        tagsRelation: true,
      },
    });

    const nextCursor = applications.length === pagination.size ? applications[applications.length - 1].id : undefined;
    return {
      data: applications.map((app: any) => ({
        id: app.id,
        name: app.name,
        description: app.description,
        criticality: app.criticality,
        lifecycleStatus: app.lifecycleStatus,
        primaryCloud: app.primaryCloud,
        tags: app.tags,
        owners: app.owners.map((assignment: any) => ({
          id: assignment.owner.id,
          name: assignment.owner.name,
          email: assignment.owner.email,
          role: assignment.role,
        })),
        components: app.components,
      })),
      meta: {
        nextCursor,
      },
    };
  }

  async getApplication(id: string) {
    return prisma.businessApplication.findUnique({
      where: { id },
      include: {
        components: {
          include: {
            repositoryLinks: { include: { repository: true } },
            dependencies: true,
            workloads: { include: { workload: true } },
          },
        },
        owners: { include: { owner: true } },
        tagsRelation: true,
      },
    });
  }

  async createApplication(input: CreateApplicationDto) {
    const application = await prisma.businessApplication.create({
      data: {
        name: input.name,
        description: input.description,
        criticality: input.criticality,
        lifecycleStatus: input.lifecycleStatus,
        primaryCloud: input.primaryCloud,
        tags: input.tags,
      },
    });
    return application;
  }

  async updateApplication(id: string, input: UpdateApplicationDto) {
    return prisma.businessApplication.update({
      where: { id },
      data: {
        ...input,
      },
    });
  }

  async deleteApplication(id: string) {
    await prisma.businessApplication.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
