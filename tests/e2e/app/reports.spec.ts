import { test, expect } from '@playwright/test';
import { credentialsRequired, hasTestCredentials, login } from '../../support/helpers/auth';

test.describe('Página de Relatórios', () => {
  test.skip(!hasTestCredentials, credentialsRequired);

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/reports');
  });

  test('deve carregar a página de relatórios', async ({ page }) => {
    await expect(page).toHaveURL(/\/reports/);
    await expect(page.getByRole('heading', { name: /Relatórios/i }).first()).toBeVisible();
  });

  test('deve exibir o período do relatório', async ({ page }) => {
    await expect(page.getByText(/Período do relatório/i)).toBeVisible();
  });

  test('deve exibir o seletor de período', async ({ page }) => {
    await expect(page.getByRole('combobox', { name: /Período/i })).toBeVisible();
  });

  test('deve exibir exportação', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Exportar/i })).toBeVisible();
  });

  test('deve exibir indicadores do período', async ({ page }) => {
    await expect(page.getByText(/chamados no período/i).first()).toBeVisible();
  });

  test('deve exibir gráfico de chamados por dia', async ({ page }) => {
    await expect(page.getByText(/Chamados por dia/i)).toBeVisible();
  });

  test('deve trocar período sem erro', async ({ page }) => {
    const period = page.getByRole('combobox', { name: /Período/i });
    await period.selectOption({ label: 'Últimos 90 dias' });
    await expect(page.getByRole('heading', { name: /Relatórios/i }).first()).toBeVisible();
  });
});
