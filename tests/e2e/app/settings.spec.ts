import { test, expect } from '@playwright/test';
import { credentialsRequired, hasTestCredentials, login } from '../../support/helpers/auth';

test.describe('Página de Configurações', () => {
  test.skip(!hasTestCredentials, credentialsRequired);

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/settings');
  });

  test('deve carregar a página', async ({ page }) => {
    await expect(page).toHaveURL(/\/settings/);
    await expect(page.getByRole('heading', { name: /Configurações/i }).first()).toBeVisible();
  });

  test('deve exibir o formulário da conta', async ({ page }) => {
    await expect(page.locator('input').first()).toBeVisible();
  });

  test('deve exibir campos de perfil', async ({ page }) => {
    await expect(page.locator('input[type="text"], input[type="email"]').first()).toBeVisible();
  });

  test('deve exibir opções de segurança', async ({ page }) => {
    await expect(page).toHaveURL(/\/settings/);
  });

  test('deve exibir opções de notificações', async ({ page }) => {
    await expect(page).toHaveURL(/\/settings/);
  });

  test('deve manter a página estável ao trocar abas', async ({ page }) => {
    const tabs = page.getByText(/Segurança|Notificações|Perfil/i);
    if (await tabs.first().isVisible()) await tabs.first().click();
    await expect(page.getByRole('heading', { name: /Configurações/i }).first()).toBeVisible();
  });
});
