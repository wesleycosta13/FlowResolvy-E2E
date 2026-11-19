import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, type Page } from '@playwright/test';

function readGeneratedCredentials(): { email: string; password: string } {
  try {
    const credentialsPath = path.join(process.cwd(), 'test-results', 'e2e-auth.json');
    return JSON.parse(readFileSync(credentialsPath, 'utf8'));
  } catch {
    return { email: '', password: '' };
  }
}

const generatedCredentials = readGeneratedCredentials();

export const testCredentials = {
  email: process.env.E2E_TEST_EMAIL ?? generatedCredentials.email,
  password: process.env.E2E_TEST_PASSWORD ?? generatedCredentials.password,
};

export const hasTestCredentials = Boolean(testCredentials.email && testCredentials.password);
export const credentialsRequired =
  'Configure E2E_TEST_EMAIL e E2E_TEST_PASSWORD para executar os cenários autenticados.';
export const isProductionE2E =
  new URL(process.env.E2E_BASE_URL ?? 'https://flowresolvy.onrender.com').hostname ===
  'flowresolvy.onrender.com';
export const productionMutationDisabled =
  'Este cenário altera dados; execute-o somente contra uma instância E2E isolada.';

export async function login(page: Page): Promise<void> {
  if (!hasTestCredentials) {
    throw new Error(credentialsRequired);
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await page.goto('/login');
    await page.locator('input[type="email"]').fill(testCredentials.email);
    await page.locator('input[type="password"]').fill(testCredentials.password);
    await page.getByRole('button', { name: /Entrar/i }).click();

    try {
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 30000 });
      await page.waitForLoadState('domcontentloaded');
      return;
    } catch (error) {
      if (attempt === 2) throw error;
      await page.waitForTimeout(1500);
    }
  }
}
