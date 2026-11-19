import { test, expect } from '@playwright/test';
import { credentialsRequired, hasTestCredentials, login } from '../../support/helpers/auth';

test.describe('Dashboard', () => {
  test.skip(!hasTestCredentials, credentialsRequired);

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('deve carregar o dashboard após login', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();
  });

  test('deve exibir os indicadores principais', async ({ page }) => {
    await expect(page.getByText(/Total de chamados/i).first()).toBeVisible();
    await expect(page.getByText(/Em andamento/i).first()).toBeVisible();
    await expect(page.getByText(/Aguardando cliente/i).first()).toBeVisible();
    await expect(page.getByText(/Resolvidos/i).first()).toBeVisible();
  });

  test('deve exibir os menus principais', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Dashboard/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Chamados/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Relatórios/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Configurações/i }).first()).toBeVisible();
  });

  test('deve navegar para Chamados', async ({ page }) => {
    await page.getByRole('link', { name: /Chamados/i }).first().click();
    await expect(page).toHaveURL(/\/tickets/);
  });

  test('deve navegar para Relatórios', async ({ page }) => {
    await page.getByRole('link', { name: /Relatórios/i }).first().click();
    await expect(page).toHaveURL(/\/reports/);
  });

  test('deve navegar para Configurações', async ({ page }) => {
    await page.getByRole('link', { name: /Configurações/i }).first().click();
    await expect(page).toHaveURL(/\/settings/);
  });

  test('deve exibir o gráfico de chamados por status', async ({ page }) => {
    await expect(page.getByText(/Chamados por status/i).first()).toBeVisible();
  });

  test('deve exibir a tabela de chamados recentes', async ({ page }) => {
    await expect(page.locator('table').first()).toBeAttached();
  });

  test('deve permitir abrir todos os chamados', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Ver todos/i }).first()).toBeVisible();
  });

  test('deve fazer logout', async ({ page }) => {
    const accountMenu = page.locator('button').filter({ hasText: /OWNER|ADMIN|TESTE/i }).first();
    await accountMenu.click();
    await page.getByText(/Sair|Encerrar sessão/i).first().click();
    await expect(page).toHaveURL(/\/login/, { timeout: 30000 });
  });
});
