import { test, expect } from '@playwright/test';
import { credentialsRequired, hasTestCredentials, login } from './helpers/auth';

test.describe('Página de Chamados (Tickets)', () => {
  test.skip(!hasTestCredentials, credentialsRequired);

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/tickets');
    await expect(page.getByText('Chamados')).toBeVisible();
  });

  test('deve carregar a página de chamados', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Chamados/i })).toBeVisible();
  });

  test('deve exibir botão Novo Chamado', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Novo Chamado/i })).toBeVisible();
  });

  test.describe('Filtros', () => {
    test('deve exibir campo de busca', async ({ page }) => {
      await expect(page.locator('input[placeholder*="Buscar"]')).toBeVisible();
    });

    test('deve exibir filtro de status', async ({ page }) => {
      const statusSelect = page.locator('select').filter({ hasText: /Todos os Status|Status/i });
      await expect(statusSelect).toBeVisible();
    });

    test('deve exibir filtro de prioridade', async ({ page }) => {
      const prioritySelect = page.locator('select').filter({ hasText: /Todas as Prioridades|Prioridade/i });
      await expect(prioritySelect).toBeVisible();
    });

    test('deve filtrar chamados por busca de texto', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="Buscar"]');
      const initialRows = await page.locator('table tbody tr').count();
      
      // Busca por texto que deve filtrar
      await searchInput.fill('Sistema');
      await page.waitForTimeout(500);
      
      const filteredRows = await page.locator('table tbody tr').count();
      // Pode ter menos ou igual resultados
      expect(filteredRows).toBeLessThanOrEqual(initialRows);
    });

    test('deve filtrar chamados por status', async ({ page }) => {
      const statusSelect = page.locator('select').filter({ hasText: /Todos os Status|Status/i });
      
      await statusSelect.selectOption({ label: 'Aberto' });
      await page.waitForTimeout(500);
      
      // Verifica que todos os itens visíveis têm status Aberto
      const rows = page.locator('table tbody tr');
      const count = await rows.count();
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const row = rows.nth(i);
          await expect(row.getByText('Aberto')).toBeVisible();
        }
      }
    });

    test('deve filtrar chamados por prioridade', async ({ page }) => {
      const prioritySelect = page.locator('select').filter({ hasText: /Todas as Prioridades|Prioridade/i });
      
      await prioritySelect.selectOption({ label: 'Alta' });
      await page.waitForTimeout(500);
      
      const rows = page.locator('table tbody tr');
      const count = await rows.count();
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const row = rows.nth(i);
          await expect(row.getByText('Alta')).toBeVisible();
        }
      }
    });
  });

  test.describe('Tabela de Chamados', () => {
    test('deve exibir tabela com colunas corretas', async ({ page }) => {
      const table = page.locator('table');
      await expect(table.getByText('ID')).toBeVisible();
      await expect(table.getByText('Título')).toBeVisible();
      await expect(table.getByText('Status')).toBeVisible();
      await expect(table.getByText('Prioridade')).toBeVisible();
      await expect(table.getByText('Responsável')).toBeVisible();
      await expect(table.getByText('Data')).toBeVisible();
      await expect(table.getByText('Ações')).toBeVisible();
    });

    test('deve exibir chamados na tabela', async ({ page }) => {
      const rows = page.locator('table tbody tr');
      const count = await rows.count();
      expect(count).toBeGreaterThan(0);
    });

    test('deve exibir badges de status com cores', async ({ page }) => {
      const firstRow = page.locator('table tbody tr').first();
      const statusBadge = firstRow.locator('span').filter({ hasText: /Aberto|Em Andamento|Resolvido|Fechado/i });
      await expect(statusBadge).toBeVisible();
    });

    test('deve exibir badges de prioridade', async ({ page }) => {
      const firstRow = page.locator('table tbody tr').first();
      const priorityBadge = firstRow.locator('span').filter({ hasText: /Baixa|Média|Alta|Crítica/i });
      await expect(priorityBadge).toBeVisible();
    });

    test('deve exibir botões de ação (editar e excluir)', async ({ page }) => {
      const firstRow = page.locator('table tbody tr').first();
      const buttons = firstRow.locator('button');
      const count = await buttons.count();
      expect(count).toBeGreaterThanOrEqual(2);
    });
  });

  test.describe('Criar Novo Chamado', () => {
    test('deve abrir modal ao clicar em Novo Chamado', async ({ page }) => {
      await page.getByRole('button', { name: /Novo Chamado/i }).click();
      
      await expect(page.getByText('Novo Chamado', { exact: false })).toBeVisible();
      await expect(page.locator('input[placeholder*="Título"]')).toBeVisible();
    });

    test('modal deve conter todos os campos', async ({ page }) => {
      await page.getByRole('button', { name: /Novo Chamado/i }).click();
      
      // Título
      await expect(page.locator('input[placeholder*="Título"]')).toBeVisible();
      // Descrição
      await expect(page.locator('textarea')).toBeVisible();
      // Prioridade
      await expect(page.locator('select').filter({ hasText: /Baixa|Média|Alta|Crítica/i })).toBeVisible();
      // Categoria
      await expect(page.locator('select').filter({ hasText: /Suporte Técnico|Financeiro/i })).toBeVisible();
    });

    test('modal deve ter botões Cancelar e Criar Chamado', async ({ page }) => {
      await page.getByRole('button', { name: /Novo Chamado/i }).click();
      
      await expect(page.getByRole('button', { name: /Cancelar/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /Criar Chamado/i })).toBeVisible();
    });

    test('deve fechar modal ao clicar em Cancelar', async ({ page }) => {
      await page.getByRole('button', { name: /Novo Chamado/i }).click();
      await expect(page.locator('input[placeholder*="Título"]')).toBeVisible();
      
      await page.getByRole('button', { name: /Cancelar/i }).click();
      
      // Modal deve fechar
      await expect(page.locator('input[placeholder*="Título"]')).not.toBeVisible();
    });

    test('deve criar chamado com sucesso', async ({ page }) => {
      const timestamp = Date.now();
      const ticketTitle = `Chamado Teste E2E ${timestamp}`;
      
      await page.getByRole('button', { name: /Novo Chamado/i }).click();
      
      await page.locator('input[placeholder*="Título"]').fill(ticketTitle);
      await page.locator('textarea').fill('Descrição do chamado criado automaticamente pelo teste E2E');
      
      // Seleciona prioridade
      const prioritySelect = page.locator('select').filter({ hasText: /Baixa|Média|Alta|Crítica/i });
      await prioritySelect.selectOption({ label: 'Alta' });
      
      // Seleciona categoria
      const categorySelect = page.locator('select').filter({ hasText: /Suporte Técnico|Financeiro/i });
      await categorySelect.selectOption({ label: 'Suporte Técnico' });
      
      await page.getByRole('button', { name: /Criar Chamado/i }).click();
      
      // Verifica toast de sucesso
      await expect(page.getByText(/criado com sucesso/i)).toBeVisible({ timeout: 5000 });
      
      // Verifica que o chamado aparece na tabela
      await expect(page.getByText(ticketTitle)).toBeVisible({ timeout: 5000 });
    });

    test('select de prioridade deve ter todas as opções', async ({ page }) => {
      await page.getByRole('button', { name: /Novo Chamado/i }).click();
      
      const prioritySelect = page.locator('select').filter({ hasText: /Baixa|Média|Alta|Crítica/i });
      const options = ['Baixa', 'Média', 'Alta', 'Crítica'];
      
      for (const opt of options) {
        await expect(prioritySelect.locator(`option:text("${opt}")`)).toBeAttached();
      }
    });

    test('select de categoria deve ter todas as opções', async ({ page }) => {
      await page.getByRole('button', { name: /Novo Chamado/i }).click();
      
      const categorySelect = page.locator('select').filter({ hasText: /Suporte Técnico|Financeiro/i });
      const options = ['Suporte Técnico', 'Financeiro', 'Comercial', 'RH', 'TI'];
      
      for (const opt of options) {
        await expect(categorySelect.locator(`option:text("${opt}")`)).toBeAttached();
      }
    });
  });

  test.describe('Editar Chamado', () => {
    test('deve abrir modal de edição ao clicar no ícone de editar', async ({ page }) => {
      const firstRow = page.locator('table tbody tr').first();
      
      // Clica no botão de editar (primeiro botão de ação)
      const editButton = firstRow.locator('button').first();
      await editButton.click();
      
      // Modal de edição deve aparecer
      await expect(page.getByText(/Editar Chamado/i)).toBeVisible({ timeout: 5000 });
    });

    test('modal de edição deve vir com dados preenchidos', async ({ page }) => {
      const firstRow = page.locator('table tbody tr').first();
      const editButton = firstRow.locator('button').first();
      await editButton.click();
      
      await expect(page.getByText(/Editar Chamado/i)).toBeVisible({ timeout: 5000 });
      
      // Título deve estar preenchido
      const titleInput = page.locator('input[placeholder*="Título"]');
      const titleValue = await titleInput.inputValue();
      expect(titleValue.length).toBeGreaterThan(0);
    });

    test('deve salvar alterações com sucesso', async ({ page }) => {
      const firstRow = page.locator('table tbody tr').first();
      const editButton = firstRow.locator('button').first();
      await editButton.click();
      
      await expect(page.getByText(/Editar Chamado/i)).toBeVisible({ timeout: 5000 });
      
      // Modifica o título
      const titleInput = page.locator('input[placeholder*="Título"]');
      await titleInput.clear();
      await titleInput.fill('Chamado Editado E2E');
      
      await page.getByRole('button', { name: /Salvar Alterações/i }).click();
      
      // Toast de sucesso ou modal fecha
      await expect(page.locator('input[placeholder*="Título"]')).not.toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Excluir Chamado', () => {
    test('deve exibir confirmação ao clicar em excluir', async ({ page }) => {
      // Escuta o dialog de confirmação
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('certeza');
        await dialog.dismiss(); // Cancela a exclusão
      });
      
      const firstRow = page.locator('table tbody tr').first();
      
      // Botão de excluir (segundo botão de ação)
      const deleteButton = firstRow.locator('button').last();
      await deleteButton.click();
    });

    test('deve excluir chamado ao confirmar', async ({ page }) => {
      const initialCount = await page.locator('table tbody tr').count();
      
      page.on('dialog', async dialog => {
        await dialog.accept(); // Confirma a exclusão
      });
      
      const firstRow = page.locator('table tbody tr').first();
      const deleteButton = firstRow.locator('button').last();
      await deleteButton.click();
      
      // Toast de sucesso
      await expect(page.getByText(/excluído com sucesso/i)).toBeVisible({ timeout: 5000 });
      
      // Pode ter menos linhas agora
      await page.waitForTimeout(500);
      const newCount = await page.locator('table tbody tr').count();
      expect(newCount).toBeLessThanOrEqual(initialCount);
    });

    test('não deve excluir ao cancelar confirmação', async ({ page }) => {
      const initialCount = await page.locator('table tbody tr').count();
      
      page.on('dialog', async dialog => {
        await dialog.dismiss(); // Cancela a exclusão
      });
      
      const firstRow = page.locator('table tbody tr').first();
      const deleteButton = firstRow.locator('button').last();
      await deleteButton.click();
      
      await page.waitForTimeout(500);
      const newCount = await page.locator('table tbody tr').count();
      expect(newCount).toBe(initialCount);
    });
  });
});
