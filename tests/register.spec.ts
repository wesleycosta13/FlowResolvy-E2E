import { test, expect } from '@playwright/test';

test.describe('Página de Registro', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('deve carregar a página de registro corretamente', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /cadastr|registr|criar conta/i })).toBeVisible();
  });

  test('deve exibir todos os campos do formulário', async ({ page }) => {
    await expect(page.locator('input[placeholder*="nome"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    // Dois campos de senha (senha e confirmar)
    const passwordFields = page.locator('input[type="password"]');
    await expect(passwordFields).toHaveCount(2);
  });

  test('deve exibir placeholders corretos', async ({ page }) => {
    await expect(page.locator('input[placeholder*="nome completo" i]')).toBeVisible();
    await expect(page.locator('input[placeholder*="email" i]')).toBeVisible();
    await expect(page.locator('input[placeholder*="6 caracteres" i]')).toBeVisible();
    await expect(page.locator('input[placeholder*="Repita a senha" i]')).toBeVisible();
  });

  test('deve exibir checkbox de Termos de Uso', async ({ page }) => {
    await expect(page.getByText(/Termos de Uso/i)).toBeVisible();
    await expect(page.locator('input[type="checkbox"]')).toBeVisible();
  });

  test('deve exibir botão Criar Conta', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Criar Conta/i })).toBeVisible();
  });

  test('deve exibir link para login', async ({ page }) => {
    await expect(page.getByText(/Já tem conta/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /login|Faça login/i })).toBeVisible();
  });

  test('link Faça login deve navegar para /login', async ({ page }) => {
    await page.getByRole('link', { name: /login|Faça login/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('deve exibir link Voltar para o início', async ({ page }) => {
    const backLink = page.getByRole('link', { name: /Voltar para o início/i });
    await expect(backLink).toBeVisible();
  });

  test('link Voltar para o início deve navegar para /', async ({ page }) => {
    await page.getByRole('link', { name: /Voltar para o início/i }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test.describe('Validação de Registro', () => {
    test('deve validar campos obrigatórios ao submeter vazio', async ({ page }) => {
      await page.getByRole('button', { name: /Criar Conta/i }).click();
      
      // Verifica validação HTML5 (required)
      const nameInput = page.locator('input[placeholder*="nome" i]');
      const isInvalid = await nameInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isInvalid).toBeTruthy();
    });

    test('deve registrar com sucesso e redirecionar para /login', async ({ page }) => {
      const timestamp = Date.now();
      
      await page.locator('input[placeholder*="nome" i]').fill(`Teste E2E ${timestamp}`);
      await page.locator('input[type="email"]').fill(`teste${timestamp}@email.com`);
      
      const passwordFields = page.locator('input[type="password"]');
      await passwordFields.nth(0).fill('SenhaForte123!');
      await passwordFields.nth(1).fill('SenhaForte123!');
      
      await page.locator('input[type="checkbox"]').check();
      
      await page.getByRole('button', { name: /Criar Conta/i }).click();

      // Deve redirecionar para login após registro bem-sucedido
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });

    test('checkbox de Termos deve ser obrigatório', async ({ page }) => {
      await page.locator('input[placeholder*="nome" i]').fill('Teste Obrigatório');
      await page.locator('input[type="email"]').fill('teste@email.com');
      
      const passwordFields = page.locator('input[type="password"]');
      await passwordFields.nth(0).fill('SenhaForte123!');
      await passwordFields.nth(1).fill('SenhaForte123!');
      
      // NÃO marca o checkbox
      await page.getByRole('button', { name: /Criar Conta/i }).click();
      
      // Verifica que não navega para login (ou mostra erro)
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(/\/register/);
    });
  });
});
