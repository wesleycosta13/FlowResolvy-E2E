import { test, expect } from '@playwright/test';

test.describe('Página de Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('deve carregar a página de login corretamente', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /login|entrar|acessar/i })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('deve exibir campos de email e senha com placeholders', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await expect(emailInput).toHaveAttribute('placeholder', /email/i);
    await expect(passwordInput).toHaveAttribute('placeholder', /••••/);
  });

  test('deve exibir checkbox Lembrar de mim', async ({ page }) => {
    await expect(page.getByText('Lembrar de mim')).toBeVisible();
    await expect(page.locator('input[type="checkbox"]')).toBeVisible();
  });

  test('deve exibir link Esqueceu a senha', async ({ page }) => {
    const forgotLink = page.getByRole('link', { name: /Esqueceu a senha/i });
    await expect(forgotLink).toBeVisible();
  });

  test('link Esqueceu a senha deve navegar para /forgot-password', async ({ page }) => {
    await page.getByRole('link', { name: /Esqueceu a senha/i }).click();
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test('deve exibir link para cadastro', async ({ page }) => {
    await expect(page.getByText(/Não tem conta/i)).toBeVisible();
    const registerLink = page.getByRole('link', { name: /Cadastre-se/i });
    await expect(registerLink).toBeVisible();
  });

  test('link Cadastre-se deve navegar para /register', async ({ page }) => {
    await page.getByRole('link', { name: /Cadastre-se/i }).click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('deve exibir link Voltar para o início', async ({ page }) => {
    const backLink = page.getByRole('link', { name: /Voltar para o início/i });
    await expect(backLink).toBeVisible();
  });

  test('link Voltar para o início deve navegar para /', async ({ page }) => {
    await page.getByRole('link', { name: /Voltar para o início/i }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test.describe('Validação de Login', () => {
    test('deve exibir erro ao submeter formulário vazio', async ({ page }) => {
      await page.getByRole('button', { name: /Entrar/i }).click();
      
      // Pode ser validação HTML5 ou mensagem customizada
      const errorMsg = page.getByText(/Credenciais inválidas|Preencha/i);
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    });

    test('deve exibir erro com credenciais inválidas', async ({ page }) => {
      await page.locator('input[type="email"]').fill('invalido@email.com');
      await page.locator('input[type="password"]').fill('senhaerrada');
      await page.getByRole('button', { name: /Entrar/i }).click();

      await expect(page.getByText(/Credenciais inválidas/i)).toBeVisible({ timeout: 5000 });
    });

    test('deve fazer login com sucesso usando credenciais válidas', async ({ page }) => {
      await page.locator('input[type="email"]').fill('admin@flowresolvy.com');
      await page.locator('input[type="password"]').fill('admin123');
      await page.getByRole('button', { name: /Entrar/i }).click();

      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    });
  });

  test('checkbox Lembrar de mim deve ser clicável', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]');
    await expect(checkbox).not.toBeChecked();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  });
});
