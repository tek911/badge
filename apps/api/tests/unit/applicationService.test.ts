import { describe, expect, it, jest } from '@jest/globals';

const findManyMock = jest.fn<() => Promise<any[]>>().mockResolvedValue([]);
const findUniqueMock = jest.fn();
const createMock = jest.fn();
const updateMock = jest.fn();

jest.mock('../../src/utils/prisma', () => ({
  prisma: {
    businessApplication: {
      findMany: findManyMock,
      findUnique: findUniqueMock,
      create: createMock,
      update: updateMock,
    },
  },
}));

import { ApplicationService } from '../../src/services/applicationService';

const service = new ApplicationService();

describe('ApplicationService', () => {
  it('returns empty list when no applications exist', async () => {
    const result = await service.listApplications({});
    expect(result.data).toEqual([]);
    expect(result.meta.nextCursor).toBeUndefined();
  });
});
