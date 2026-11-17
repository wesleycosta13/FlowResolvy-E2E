import { test, expect, type Page } from '@playwright/test';

async function login(page: Page) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await page.locator('input[type="email"]').fill('admin@flowresolvy.com');
  await page.locator('input[type="password"]').fill('admin123');
  await page.getByRole('button', { name: /Entrar/i }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 30000 });
  await page.waitForLoadState('networkidle');
}

test.describe('Página de Relatórios', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/reports');
  });

  test('deve carregar a página de relatórios', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Relatórios/i })).toBeVisible();
    await expect(page.getByText(/Análise detalhada/i)).toBeVisible();
  });

  test.describe('Filtros', () => {
    test('deve exibir filtro de período', async ({ page }) => {
      const periodSelect = page.locator('select').filter({ hasText: /7 dias|30 dias|90 dias/i });
      await expect(periodSelect).toBeVisible();
    });

    test('filtro de período deve ter as opções corretas', async ({ page }) => {
      const periodSelect = page.locator('select').filter({ hasText: /7 dias|30 dias|90 dias/i });
      
      const options = ['Últimos 7 dias', 'Últimos 30 dias', 'Últimos 90 dias', 'Último ano'];
      for (const opt of options) {
        await expect(periodSelect.locator(`option`).filter({ hasText: opt })).toBeAttached();
      }
    });

    test('deve exibir botão Exportar PDF', async ({ page }) => {
      await expect(page.getByRole('button', { name: /Exportar PDF/i })).toBeVisible();
    });

    test('deve trocar período sem erro', async ({ page }) => {
      const periodSelect = page.locator('select').filter({ hasText: /7 dias|30 dias|90 dias/i });
      
      await periodSelect.selectOption({ label: 'Últimos 30 dias' });
      await page.waitForTimeout(500);
      
      // A página não deve quebrar
      await expect(page.getByRole('heading', { name: /Relatórios/i })).toBeVisible();
    });
  });

  test.describe('Cards de Estatísticas', () => {
    test('deve exibir Total de Chamados', async ({ page }) => {
      await expect(page.getByText('Total de Chamados')).toBeVisible();
      await expect(page.getByText('156')).toBeVisible();
    });

    test('deve exibir Tempo Médio de Resolução', async ({ page }) => {
      await expect(page.getByText(/Tempo Médio/i)).toBeVisible();
      await expect(page.getByText('4.2h')).toBeVisible();
    });

    test('deve exibir Taxa de Resolução', async ({ page }) => {
      await expect(page.getByText(/Taxa de Resolução/i)).toBeVisible();
      await expect(page.getByText('85%')).toBeVisible();
    });

    test('deve exibir Satisfação do Cliente', async ({ page }) => {
      await expect(page.getByText(/Satisfação/i)).toBeVisible();
      await expect(page.getByText('4.5/5')).toBeVisible();
    });
  });

  test.describe('Gráficos', () => {
    test('deve exibir gráfico de Evolução de Chamados', async ({ page }) => {
      await expect(page.getByText('Evolução de Chamados')).toBeVisible();
    });

    test('deve exibir gráfico de Distribuição por Categoria', async ({ page }) => {
      await expect(page.getByText('Distribuição por Categoria')).toBeVisible();
    });
  });

  test.describe('Tabela de Performance por Categoria', () => {
    test('deve exibir tabela com colunas corretas', async ({ page }) => {
      const table = page.locator('table');
      await expect(table).toBeVisible();
      
      await expect(table.getByText('Categoria')).toBeVisible();
      await expect(table.getByText('Total')).toBeVisible();
      await expect(table.getByText('Resolvidos')).toBeVisible();
      await expect(table.getByText('Tempo Médio')).toBeVisible();
      await expect(table.getByText('Satisfação')).toBeVisible();
    });

    test('deve exibir todas as categorias', async ({ page }) => {
      const categories = ['Suporte Técnico', 'Financeiro', 'Comercial', 'RH', 'TI'];
      
      for (const category of categories) {
        await expect(page.locator('table').getByText(category)).toBeVisible();
      }
    });
  });
});
