import { test } from '@playwright/test';

test.describe('Application mapping', () => {
  test.skip('confirms workload linkage', async ({ page }) => {
    await page.goto('/applications');
  });
});
