import { test, expect } from '@playwright/test';
import {
  credentialsRequired,
  hasTestCredentials,
  login,
  testCredentials,
} from './helpers/auth';

test.describe('Página de Configurações', () => {
  test.skip(!hasTestCredentials, credentialsRequired);

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/settings');
  });

  test('deve carregar a página de configurações', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Configurações/i })).toBeVisible();
    await expect(page.getByText(/preferências e configurações/i)).toBeVisible();
  });

  test.describe('Navegação por Tabs', () => {
    test('deve exibir as 3 tabs', async ({ page }) => {
      await expect(page.getByRole('button', { name: /Perfil/i }).or(page.getByRole('tab', { name: /Perfil/i }))).toBeVisible();
      await expect(page.getByRole('button', { name: /Notificações/i }).or(page.getByRole('tab', { name: /Notificações/i }))).toBeVisible();
      await expect(page.getByRole('button', { name: /Segurança/i }).or(page.getByRole('tab', { name: /Segurança/i }))).toBeVisible();
    });

    test('tab Perfil deve estar ativa por padrão', async ({ page }) => {
      await expect(page.getByText('Informações Pessoais')).toBeVisible();
    });
  });

  test.describe('Tab Perfil', () => {
    test('deve exibir campos de perfil preenchidos', async ({ page }) => {
      const nameInput = page.locator('input').filter({ hasText: '' }).locator('[value="Admin"], input[value="Admin"]').or(
        page.getByLabel(/Nome completo/i)
      );
      
      // Verifica que existe campo de nome
      await expect(page.getByText('Nome completo')).toBeVisible();
      await expect(page.getByText('Email')).toBeVisible();
      await expect(page.getByText('Cargo')).toBeVisible();
      await expect(page.getByText('Departamento')).toBeVisible();
    });

    test('campo de nome deve conter Admin', async ({ page }) => {
      // Busca input que contenha o valor Admin
      const inputs = page.locator('input[type="text"]');
      const count = await inputs.count();
      let foundAdmin = false;
      
      for (let i = 0; i < count; i++) {
        const value = await inputs.nth(i).inputValue();
        if (value === 'Admin') {
          foundAdmin = true;
          break;
        }
      }
      expect(foundAdmin).toBeTruthy();
    });

    test('campo de email deve conter o email da conta de teste', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toHaveValue(testCredentials.email);
    });

    test('deve exibir select de departamento', async ({ page }) => {
      const deptSelect = page.locator('select').filter({ hasText: /TI|Suporte|Comercial/i });
      await expect(deptSelect).toBeVisible();
    });

    test('select de departamento deve ter as opções corretas', async ({ page }) => {
      const deptSelect = page.locator('select').filter({ hasText: /TI|Suporte|Comercial/i });
      const options = ['TI', 'Suporte', 'Comercial', 'Financeiro', 'RH'];
      
      for (const opt of options) {
        await expect(deptSelect.locator(`option`).filter({ hasText: opt })).toBeAttached();
      }
    });

    test('deve salvar alterações do perfil com sucesso', async ({ page }) => {
      await page.getByRole('button', { name: /Salvar Alterações/i }).click();
      
      await expect(page.getByText(/salvas com sucesso|salvo/i)).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Tab Notificações', () => {
    test.beforeEach(async ({ page }) => {
      // Clica na tab Notificações
      const notifTab = page.getByRole('button', { name: /Notificações/i }).or(page.getByRole('tab', { name: /Notificações/i }));
      await notifTab.click();
    });

    test('deve exibir toggles de notificação', async ({ page }) => {
      await expect(page.getByText('Novos chamados')).toBeVisible();
      await expect(page.getByText('Atualizações de chamados')).toBeVisible();
      await expect(page.getByText('Chamados atribuídos')).toBeVisible();
      await expect(page.getByText('Relatórios semanais')).toBeVisible();
      await expect(page.getByText('Alertas de SLA')).toBeVisible();
    });

    test('deve exibir botão Salvar Preferências', async ({ page }) => {
      await expect(page.getByRole('button', { name: /Salvar Preferências/i })).toBeVisible();
    });

    test('deve alternar toggle de notificação', async ({ page }) => {
      // Clica no toggle de Relatórios semanais (que está desligado por padrão)
      const toggleArea = page.getByText('Relatórios semanais').locator('..');
      const toggle = toggleArea.locator('input[type="checkbox"], [role="switch"], button').first();
      
      await toggle.click();
      await page.waitForTimeout(300);
    });
  });

  test.describe('Tab Segurança', () => {
    test.beforeEach(async ({ page }) => {
      const secTab = page.getByRole('button', { name: /Segurança/i }).or(page.getByRole('tab', { name: /Segurança/i }));
      await secTab.click();
    });

    test('deve exibir seção de Alterar Senha', async ({ page }) => {
      await expect(page.getByText('Alterar Senha')).toBeVisible();
    });

    test('deve exibir campos de senha', async ({ page }) => {
      await expect(page.getByText('Senha atual')).toBeVisible();
      await expect(page.getByText('Nova senha')).toBeVisible();
      await expect(page.getByText('Confirmar nova senha')).toBeVisible();
      
      const passwordFields = page.locator('input[type="password"]');
      const count = await passwordFields.count();
      expect(count).toBeGreaterThanOrEqual(3);
    });

    test('deve exibir botão Alterar Senha', async ({ page }) => {
      await expect(page.getByRole('button', { name: /Alterar Senha/i })).toBeVisible();
    });

    test('deve exibir seção Sessões Ativas', async ({ page }) => {
      await expect(page.getByText(/Sessões Ativas/i)).toBeVisible();
    });

    test('deve exibir sessão atual', async ({ page }) => {
      await expect(page.getByText(/Chrome/i)).toBeVisible();
      await expect(page.getByText(/Ativa/i)).toBeVisible();
    });

    test('deve exibir botão Encerrar Todas as Sessões', async ({ page }) => {
      await expect(page.getByRole('button', { name: /Encerrar Todas as Sessões/i })).toBeVisible();
    });
  });
});
