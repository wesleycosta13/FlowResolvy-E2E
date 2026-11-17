import { test, expect } from '@playwright/test';
import { credentialsRequired, hasTestCredentials, login } from '../../support/helpers/auth';

test.describe('Dashboard', () => {
  test.skip(!hasTestCredentials, credentialsRequired);

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('deve carregar o dashboard após login', async ({ page }) => {
    await expect(page.getByText(/Bem-vindo de volta/i)).toBeVisible();
  });

  test('deve exibir saudação com nome do usuário', async ({ page }) => {
    await expect(page.getByText(/Bem-vindo de volta, Admin/i)).toBeVisible();
  });

  test('deve exibir subtítulo do dashboard', async ({ page }) => {
    await expect(page.getByText(/resumo dos seus chamados/i)).toBeVisible();
  });

  test.describe('Sidebar / Navegação', () => {
    test('deve exibir logo FlowResolvy na sidebar', async ({ page }) => {
      await expect(page.getByText('FlowResolvy').first()).toBeVisible();
    });

    test('deve exibir todos os itens do menu', async ({ page }) => {
      await expect(page.getByRole('link', { name: /Dashboard/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Chamados/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Relatórios/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Configurações/i })).toBeVisible();
    });

    test('deve navegar para Chamados ao clicar no menu', async ({ page }) => {
      await page.getByRole('link', { name: /Chamados/i }).click();
      await expect(page).toHaveURL(/\/tickets/);
    });

    test('deve navegar para Relatórios ao clicar no menu', async ({ page }) => {
      await page.getByRole('link', { name: /Relatórios/i }).click();
      await expect(page).toHaveURL(/\/reports/);
    });

    test('deve navegar para Configurações ao clicar no menu', async ({ page }) => {
      await page.getByRole('link', { name: /Configurações/i }).click();
      await expect(page).toHaveURL(/\/settings/);
    });

    test('deve exibir nome do usuário na sidebar', async ({ page }) => {
      await expect(page.locator('aside, nav').getByText('Admin')).toBeVisible();
    });

    test('deve exibir botão Sair', async ({ page }) => {
      await expect(page.getByRole('button', { name: /Sair/i })).toBeVisible();
    });
  });

  test.describe('Cards de Estatísticas', () => {
    test('deve exibir card Total de Chamados', async ({ page }) => {
      await expect(page.getByText('Total de Chamados')).toBeVisible();
      await expect(page.getByText('156')).toBeVisible();
    });

    test('deve exibir card Em Aberto', async ({ page }) => {
      await expect(page.getByText('Em Aberto')).toBeVisible();
      await expect(page.getByText('23')).toBeVisible();
    });

    test('deve exibir card Em Andamento', async ({ page }) => {
      await expect(page.getByText('Em Andamento')).toBeVisible();
      await expect(page.getByText('45')).toBeVisible();
    });

    test('deve exibir card Resolvidos', async ({ page }) => {
      await expect(page.getByText('Resolvidos')).toBeVisible();
      await expect(page.getByText('88')).toBeVisible();
    });
  });

  test.describe('Gráficos', () => {
    test('deve exibir gráfico de Chamados por Status', async ({ page }) => {
      await expect(page.getByText('Chamados por Status')).toBeVisible();
    });

    test('deve exibir gráfico de Chamados por Prioridade', async ({ page }) => {
      await expect(page.getByText('Chamados por Prioridade')).toBeVisible();
    });
  });

  test.describe('Tabela de Chamados Recentes', () => {
    test('deve exibir tabela com colunas corretas', async ({ page }) => {
      const table = page.locator('table');
      await expect(table).toBeVisible();
      
      await expect(table.getByText('ID')).toBeVisible();
      await expect(table.getByText('Título')).toBeVisible();
      await expect(table.getByText('Status')).toBeVisible();
      await expect(table.getByText('Prioridade')).toBeVisible();
      await expect(table.getByText('Data')).toBeVisible();
    });

    test('deve exibir chamados na tabela', async ({ page }) => {
      const rows = page.locator('table tbody tr');
      const count = await rows.count();
      expect(count).toBeGreaterThan(0);
    });

    test('deve exibir link Ver todos os chamados', async ({ page }) => {
      const link = page.getByRole('link', { name: /Ver todos os chamados/i });
      await expect(link).toBeVisible();
    });

    test('link Ver todos deve navegar para /tickets', async ({ page }) => {
      await page.getByRole('link', { name: /Ver todos os chamados/i }).click();
      await expect(page).toHaveURL(/\/tickets/);
    });
  });

  test.describe('Logout', () => {
    test('deve fazer logout e redirecionar para /login', async ({ page }) => {
      await page.getByRole('button', { name: /Sair/i }).click();
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });
  });
});
