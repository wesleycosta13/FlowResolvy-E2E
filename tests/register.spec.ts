import { test, expect } from '@playwright/test';
import { RegisterPage } from './pages/register.page';

test.describe('Página de Registro', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.openRegister();
  });

  test('deve carregar a página de registro corretamente', async ({ page }) => {
    await expect(registerPage.heading).toBeVisible();
  });

  test('deve exibir todos os campos do formulário', async ({ page }) => {
    await expect(registerPage.nameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInputs).toHaveCount(2);
  });

  test('deve exibir placeholders corretos', async ({ page }) => {
    await expect(registerPage.locator('input[placeholder*="nome completo" i]')).toBeVisible();
    await expect(registerPage.locator('input[placeholder*="email" i]')).toBeVisible();
    await expect(registerPage.locator('input[placeholder*="6 caracteres" i]')).toBeVisible();
    await expect(registerPage.locator('input[placeholder*="Repita a senha" i]')).toBeVisible();
  });

  test('deve exibir checkbox de Termos de Uso', async ({ page }) => {
    await expect(registerPage.getByText(/Termos de Uso/i)).toBeVisible();
    await expect(registerPage.termsCheckbox).toBeVisible();
  });

  test('deve exibir botão Criar Conta', async ({ page }) => {
    await expect(registerPage.createAccountButton).toBeVisible();
  });

  test('deve exibir link para login', async ({ page }) => {
    await expect(registerPage.getByText(/Já tem conta/i)).toBeVisible();
    await expect(registerPage.loginLink).toBeVisible();
  });

  test('link Faça login deve navegar para /login', async ({ page }) => {
    await registerPage.loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('deve exibir link Voltar para o início', async ({ page }) => {
    await expect(registerPage.homeLink).toBeVisible();
  });

  test('link Voltar para o início deve navegar para /', async ({ page }) => {
    await registerPage.homeLink.click();
    await expect(page).toHaveURL(/\/$/);
  });

  test.describe('Validação de Registro', () => {
    test('deve validar campos obrigatórios ao submeter vazio', async ({ page }) => {
      await registerPage.createAccountButton.click();
      
      // Verifica validação HTML5 (required)
      const isInvalid = await registerPage.nameInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isInvalid).toBeTruthy();
    });

    test('deve registrar com sucesso e redirecionar para /login', async ({ page }) => {
      const timestamp = Date.now();
      
      await registerPage.fillRegistration(
        `Teste E2E ${timestamp}`,
        `teste${timestamp}@email.com`,
        'SenhaForte123!',
      );
      await registerPage.createAccountButton.click();

      // Deve redirecionar para login após registro bem-sucedido
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });

    test('checkbox de Termos deve ser obrigatório', async ({ page }) => {
      await registerPage.nameInput.fill('Teste Obrigatório');
      await registerPage.emailInput.fill('teste@email.com');
      await registerPage.passwordInputs.nth(0).fill('SenhaForte123!');
      await registerPage.passwordInputs.nth(1).fill('SenhaForte123!');
      
      // NÃO marca o checkbox
      await registerPage.createAccountButton.click();
      
      // Verifica que não navega para login (ou mostra erro)
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(/\/register/);
    });
  });
});
