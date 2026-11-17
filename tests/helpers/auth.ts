import { expect, type Page } from '@playwright/test';

export const testCredentials = {
  email: process.env.E2E_TEST_EMAIL ?? '',
  password: process.env.E2E_TEST_PASSWORD ?? '',
};

export const hasTestCredentials = Boolean(testCredentials.email && testCredentials.password);
export const credentialsRequired =
  'Configure E2E_TEST_EMAIL e E2E_TEST_PASSWORD para executar os cenários autenticados.';

export async function login(page: Page): Promise<void> {
  if (!hasTestCredentials) {
    throw new Error(credentialsRequired);
  }

  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await page.locator('input[type="email"]').fill(testCredentials.email);
  await page.locator('input[type="password"]').fill(testCredentials.password);
  await page.getByRole('button', { name: /Entrar/i }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 30000 });
  await page.waitForLoadState('networkidle');
}
