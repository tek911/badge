import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'pnpm --filter web dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:5173',
  },
  testDir: './tests',
});
