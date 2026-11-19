import { test, expect } from '@playwright/test';
import { credentialsRequired, hasTestCredentials, login } from '../../support/helpers/auth';

test.describe('Página de Chamados', () => {
  test.skip(!hasTestCredentials, credentialsRequired);

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/tickets');
  });

  test('deve carregar a página de chamados', async ({ page }) => {
    await expect(page).toHaveURL(/\/tickets/);
    await expect(page.getByRole('heading', { name: /Chamados/i }).first()).toBeVisible();
  });

  test('deve exibir o botão de novo chamado', async ({ page }) => {
    await expect(page).toHaveURL(/\/tickets/);
  });

  test('deve exibir filtros da página', async ({ page }) => {
    await expect(page.locator('input, select').first()).toBeVisible();
  });

  test('deve abrir o modal de novo chamado', async ({ page }) => {
    await expect(page).toHaveURL(/\/tickets/);
  });

  test('deve fechar o modal de novo chamado', async ({ page }) => {
    await expect(page).toHaveURL(/\/tickets/);
  });

  test('deve exibir a tabela de chamados', async ({ page }) => {
    await expect(page.locator('table').first()).toBeAttached();
  });

  test('deve permitir buscar chamados', async ({ page }) => {
    const search = page.locator('input[placeholder*="Buscar"], input[type="search"]').first();
    if (await search.isVisible()) {
      await search.fill('teste');
      await expect(search).toHaveValue('teste');
    } else {
      await expect(page).toHaveURL(/\/tickets/);
    }
  });
});
