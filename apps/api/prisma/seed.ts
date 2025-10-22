import { PrismaClient, OwnerType, ComponentType, WorkloadPlatform, WorkloadType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.imageToWorkload.deleteMany();
  await prisma.componentToWorkload.deleteMany();
  await prisma.libraryDependency.deleteMany();
  await prisma.repoComponentLink.deleteMany();
  await prisma.containerImage.deleteMany();
  await prisma.workload.deleteMany();
  await prisma.repository.deleteMany();
  await prisma.component.deleteMany();
  await prisma.applicationOwner.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.businessApplication.deleteMany();
  await prisma.owner.deleteMany();

  const owners = await prisma.owner.createMany({
    data: [
      { name: 'Alice Carter', email: 'alice.carter@example.com', type: OwnerType.TECHNICAL },
      { name: 'Benjamin Stone', email: 'ben.stone@example.com', type: OwnerType.BUSINESS },
      { name: 'Chloe Patel', email: 'chloe.patel@example.com', type: OwnerType.TECHNICAL },
      { name: 'Diego Fernandez', email: 'diego.fernandez@example.com', type: OwnerType.BUSINESS }
    ]
  });

  console.log(`Seeded ${owners.count} owners`);

  const applications = await prisma.businessApplication.createMany({
    data: [
      {
        name: 'Payments Platform',
        description: 'Handles payment processing and settlement.',
        criticality: 'HIGH',
        lifecycleStatus: 'ACTIVE',
        tags: [{ key: 'domain', value: 'finance' }],
        primaryCloud: 'AWS'
      },
      {
        name: 'Checkout Web',
        description: 'Customer checkout experience.',
        criticality: 'HIGH',
        lifecycleStatus: 'ACTIVE',
        tags: [{ key: 'domain', value: 'commerce' }],
        primaryCloud: 'GCP'
      },
      {
        name: 'Inventory Service',
        description: 'Inventory tracking microservice.',
        criticality: 'MEDIUM',
        lifecycleStatus: 'ACTIVE',
        tags: [{ key: 'domain', value: 'supply-chain' }],
        primaryCloud: 'Azure'
      },
      {
        name: 'Analytics Pipeline',
        description: 'ETL pipeline feeding analytics warehouse.',
        criticality: 'HIGH',
        lifecycleStatus: 'ACTIVE',
        tags: [{ key: 'domain', value: 'data' }],
        primaryCloud: 'AWS'
      },
      {
        name: 'Mobile API',
        description: 'Backend-for-frontend serving mobile clients.',
        criticality: 'MEDIUM',
        lifecycleStatus: 'ACTIVE',
        tags: [{ key: 'domain', value: 'mobile' }],
        primaryCloud: 'AWS'
      },
      {
        name: 'Data Warehouse',
        description: 'Centralized analytics warehouse.',
        criticality: 'HIGH',
        lifecycleStatus: 'ACTIVE',
        tags: [{ key: 'domain', value: 'analytics' }],
        primaryCloud: 'GCP'
      }
    ]
  });

  console.log(`Seeded ${applications.count} applications`);

  const techOwner = await prisma.owner.findFirst({ where: { email: 'alice.carter@example.com' } });
  const businessOwner = await prisma.owner.findFirst({ where: { email: 'ben.stone@example.com' } });

  const paymentApp = await prisma.businessApplication.findFirst({ where: { name: 'Payments Platform' } });
  const checkoutApp = await prisma.businessApplication.findFirst({ where: { name: 'Checkout Web' } });

  if (!techOwner || !businessOwner || !paymentApp || !checkoutApp) {
    throw new Error('Seed prerequisites missing');
  }

  await prisma.applicationOwner.createMany({
    data: [
      { businessApplicationId: paymentApp.id, ownerId: techOwner.id, role: 'TECH_LEAD' },
      { businessApplicationId: paymentApp.id, ownerId: businessOwner.id, role: 'BUSINESS_OWNER' },
      { businessApplicationId: checkoutApp.id, ownerId: techOwner.id, role: 'ENGINEERING_MANAGER' }
    ]
  });

  const paymentBackend = await prisma.component.create({
    data: {
      businessApplicationId: paymentApp.id,
      type: ComponentType.BACKEND,
      name: 'payments-api',
      description: 'Node.js API processing payments.'
    }
  });

  const checkoutFrontend = await prisma.component.create({
    data: {
      businessApplicationId: checkoutApp.id,
      type: ComponentType.FRONTEND,
      name: 'checkout-web',
      description: 'React storefront for checkout.'
    }
  });

  const repo = await prisma.repository.create({
    data: {
      host: 'github',
      org: 'acme',
      name: 'payments-platform',
      defaultBranch: 'main',
      url: 'https://github.com/acme/payments-platform',
      visibility: 'private',
      primaryLanguage: 'TypeScript',
      topics: ['payments', 'node'],
      tags: [{ key: 'owner', value: 'team-payments' }],
      license: 'Apache-2.0'
    }
  });

  await prisma.repoComponentLink.create({
    data: {
      componentId: paymentBackend.id,
      repositoryId: repo.id,
      path: 'services/payments-api',
      buildSystem: 'turbo',
      packageManager: 'pnpm',
      confidence: 0.92,
      provenance: { source: 'ci-event', commit: 'a1b2c3d4' }
    }
  });

  await prisma.libraryDependency.createMany({
    data: [
      { componentId: paymentBackend.id, name: 'express', version: '4.18.2', license: 'MIT', ecosystem: 'npm', source: 'lockfile' },
      { componentId: paymentBackend.id, name: 'prisma', version: '5.9.1', license: 'Apache-2.0', ecosystem: 'npm', source: 'lockfile' },
      { componentId: checkoutFrontend.id, name: 'react', version: '18.2.0', license: 'MIT', ecosystem: 'npm', source: 'sbom' }
    ]
  });

  const image = await prisma.containerImage.create({
    data: {
      registry: 'registry.acme.io',
      repository: 'payments-api',
      tag: '2024.02.11',
      digest: 'sha256:deadbeef',
      baseImage: 'node:20-alpine',
      vulnerabilitiesSummary: { critical: 0, high: 1, medium: 3 }
    }
  });

  const workload = await prisma.workload.create({
    data: {
      type: WorkloadType.CONTAINER,
      platform: WorkloadPlatform.AWS,
      name: 'payments-api-prod',
      region: 'us-east-1',
      accountId: '123456789012',
      cluster: 'payments-eks',
      namespace: 'prod-payments',
      serviceType: 'Deployment',
      runtimeTags: { app: 'payments', env: 'prod' },
      url: 'https://payments.api.acme.io',
      status: 'Healthy'
    }
  });

  await prisma.imageToWorkload.create({
    data: {
      containerImageId: image.id,
      workloadId: workload.id,
      confidence: 0.95,
      provenance: { source: 'aws-ecr', matchedTag: 'payments-api:2024.02.11' }
    }
  });

  await prisma.componentToWorkload.create({
    data: {
      componentId: paymentBackend.id,
      workloadId: workload.id,
      confidence: 0.93,
      provenance: { source: 'reconciler', rules: ['ci-event', 'tag-match'] }
    }
  });

  await prisma.tag.createMany({
    data: [
      { businessApplicationId: paymentApp.id, key: 'cost-center', value: 'fin-ops', source: 'cloud' },
      { businessApplicationId: paymentApp.id, key: 'owner', value: 'team-payments', source: 'scm' }
    ]
  });

  console.log('Seed data complete');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
