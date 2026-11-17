import { test, expect } from '@playwright/test';
import { credentialsRequired, hasTestCredentials, login, testCredentials } from './helpers/auth';

test.describe('Fluxo Completo E2E', () => {
  test('deve completar o fluxo: Register → Login → Dashboard → Criar Ticket → Ver Tickets → Logout', async ({ page }) => {
    test.skip(!hasTestCredentials, credentialsRequired);

    // ===== 1. REGISTRO =====
    await page.goto('/register');
    
    const timestamp = Date.now();
    const testEmail = `e2eflow${timestamp}@example.invalid`;
    
    await page.locator('input[placeholder*="nome" i]').fill(`Teste Fluxo ${timestamp}`);
    await page.locator('input[type="email"]').fill(testEmail);
    
    const passwordFields = page.locator('input[type="password"]');
    await passwordFields.nth(0).fill('FluxoE2E123!');
    await passwordFields.nth(1).fill('FluxoE2E123!');
    
    await page.locator('input[type="checkbox"]').check();
    await page.getByRole('button', { name: /Criar Conta/i }).click();
    
    // Deve redirecionar para login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    
    // ===== 2. LOGIN (com admin para acessar) =====
    await page.waitForLoadState('networkidle');
    await page.locator('input[type="email"]').fill(testCredentials.email);
    await page.locator('input[type="password"]').fill(testCredentials.password);
    await page.getByRole('button', { name: /Entrar/i }).click();
    
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    
    // ===== 3. DASHBOARD =====
    await expect(page.getByText(/Bem-vindo de volta/i)).toBeVisible();
    await expect(page.getByText('Total de Chamados')).toBeVisible();
    
    // ===== 4. NAVEGAR PARA CHAMADOS =====
    await page.getByRole('link', { name: /Chamados/i }).click();
    await expect(page).toHaveURL(/\/tickets/);
    
    // ===== 5. CRIAR UM NOVO CHAMADO =====
    await page.getByRole('button', { name: /Novo Chamado/i }).click();
    
    const ticketTitle = `Fluxo E2E ${timestamp}`;
    await page.locator('input[placeholder*="Título"]').fill(ticketTitle);
    await page.locator('textarea').fill('Teste completo do fluxo E2E');
    
    const prioritySelect = page.locator('select').filter({ hasText: /Baixa|Média|Alta|Crítica/i });
    await prioritySelect.selectOption({ label: 'Alta' });
    
    const categorySelect = page.locator('select').filter({ hasText: /Suporte Técnico|Financeiro/i });
    await categorySelect.selectOption({ label: 'TI' });
    
    await page.getByRole('button', { name: /Criar Chamado/i }).click();
    
    // Toast de sucesso
    await expect(page.getByText(/criado com sucesso/i)).toBeVisible({ timeout: 5000 });
    
    // Chamado visível na tabela
    await expect(page.getByText(ticketTitle)).toBeVisible({ timeout: 5000 });
    
    // ===== 6. NAVEGAR PARA RELATÓRIOS =====
    await page.getByRole('link', { name: /Relatórios/i }).click();
    await expect(page).toHaveURL(/\/reports/);
    await expect(page.getByText(/Relatórios/i)).toBeVisible();
    
    // ===== 7. NAVEGAR PARA CONFIGURAÇÕES =====
    await page.getByRole('link', { name: /Configurações/i }).click();
    await expect(page).toHaveURL(/\/settings/);
    await expect(page.getByText(/Configurações/i)).toBeVisible();
    
    // ===== 8. LOGOUT =====
    await page.getByRole('button', { name: /Sair/i }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('deve impedir acesso ao dashboard sem login após logout', async ({ page }) => {
    test.skip(!hasTestCredentials, credentialsRequired);

    // Login
    await login(page);
    
    // Logout
    await page.getByRole('button', { name: /Sair/i }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    
    // Tenta acessar dashboard
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('deve navegar entre todas as seções da landing page', async ({ page }) => {
    await page.goto('/');
    
    // Scroll para Recursos
    await page.getByRole('link', { name: /Recursos/i }).first().click();
    await expect(page.getByText('Gestão Inteligente')).toBeVisible();
    
    // Scroll para Planos
    await page.getByRole('link', { name: /Planos/i }).first().click();
    await expect(page.getByText('Básico')).toBeVisible();
    
    // Scroll para Contato
    await page.getByRole('link', { name: /Contato/i }).first().click();
    await expect(page.getByText('Enviar Mensagem')).toBeVisible();
    
    // Volta para o início
    await page.getByRole('link', { name: /Início/i }).first().click();
    await expect(page.getByText('Gerencie seus chamados')).toBeVisible();
  });

  test('fluxo de recuperação de senha', async ({ page }) => {
    // Login page
    await page.goto('/login');
    
    // Esqueceu a senha
    await page.getByRole('link', { name: /Esqueceu a senha/i }).click();
    await expect(page).toHaveURL(/\/forgot-password/);
    
    // Preenche email
    await page.locator('input[type="email"]').fill('recuperacao@example.invalid');
    await page.getByRole('button', { name: /Enviar Link|Recuperar/i }).click();
    
    // Mensagem de sucesso
    await expect(page.getByText(/link de recuperação/i)).toBeVisible({ timeout: 5000 });
    
    // Volta para login
    await page.getByRole('link', { name: /Voltar para o login/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
