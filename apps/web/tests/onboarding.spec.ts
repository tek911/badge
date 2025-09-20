import { test } from '@playwright/test';

test.describe('Onboarding flow', () => {
  test.skip('walkthrough pending backend', async ({ page }) => {
    await page.goto('/');
  });
});
