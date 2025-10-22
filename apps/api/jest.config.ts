import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
  moduleNameMapper: {
    '^@domain/(.*)$': '<rootDir>/../../packages/domain/src/$1',
    '^@shared/sdk$': '<rootDir>/../../packages/shared/src/index.ts',
    '^@shared/sdk/(.*)$': '<rootDir>/../../packages/shared/src/$1',
  },
};

export default config;
