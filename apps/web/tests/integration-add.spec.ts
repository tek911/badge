import { test } from '@playwright/test';

test.describe('Integration setup', () => {
  test.skip('adds github connector', async ({ page }) => {
    await page.goto('/integrations');
  });
});
