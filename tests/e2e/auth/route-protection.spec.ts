import { test, expect } from '@playwright/test';

test.describe('Proteção de rotas', () => {
  test('deve redirecionar /dashboard para /login quando não autenticado', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/, { timeout: 30000 });
  });

  test('deve redirecionar /tickets para /login quando não autenticado', async ({ page }) => {
    await page.goto('/tickets');
    await expect(page).toHaveURL(/\/login/, { timeout: 30000 });
  });

  test('deve redirecionar /reports para /login quando não autenticado', async ({ page }) => {
    await page.goto('/reports');
    await expect(page).toHaveURL(/\/login/, { timeout: 30000 });
  });

  test('deve redirecionar /settings para /login quando não autenticado', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).toHaveURL(/\/login/, { timeout: 30000 });
  });
});
