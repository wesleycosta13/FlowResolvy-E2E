import { test, expect } from '@playwright/test';
import { RegisterPage } from './pages/register.page';
import { isProductionE2E, productionMutationDisabled } from './helpers/auth';

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
    await expect(registerPage.companyNameInput).toBeVisible();
    await expect(registerPage.ownerNameInput).toBeVisible();
    await expect(registerPage.cpfCnpjInput).toBeVisible();
    await expect(registerPage.phoneInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInputs).toHaveCount(2);
  });

  test('deve exibir placeholders corretos', async ({ page }) => {
    await expect(registerPage.companyNameInput).toBeVisible();
    await expect(registerPage.ownerNameInput).toBeVisible();
    await expect(registerPage.emailInput).toHaveAttribute('placeholder', 'seu@empresa.com');
    await expect(registerPage.passwordInputs.nth(0)).toHaveAttribute('placeholder', 'Mínimo de 8 caracteres');
    await expect(registerPage.passwordInputs.nth(1)).toHaveAttribute('placeholder', 'Repita sua senha');
  });

  test('deve exibir botão Criar Conta', async ({ page }) => {
    await expect(registerPage.createAccountButton).toBeVisible();
  });

  test('deve exibir link para login', async ({ page }) => {
    await expect(registerPage.getByText(/Já tem uma conta/i)).toBeVisible();
    await expect(registerPage.loginLink).toBeVisible();
  });

  test('link Faça login deve navegar para /login', async ({ page }) => {
    await registerPage.loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test.describe('Validação de Registro', () => {
    test('deve validar campos obrigatórios ao submeter vazio', async ({ page }) => {
      await registerPage.createAccountButton.click();

      const companyNameIsRequired = await registerPage.companyNameInput.evaluate(
        (input: HTMLInputElement) => input.required,
      );
      expect(companyNameIsRequired).toBe(true);
    });

    test('deve registrar com sucesso e redirecionar para /login', async ({ page }) => {
      test.skip(isProductionE2E, productionMutationDisabled);
      const timestamp = Date.now();
      
      await registerPage.fillRegistration(
        `Empresa E2E ${timestamp}`,
        `Teste E2E ${timestamp}`,
        `teste${timestamp}@example.invalid`,
        'SenhaForte123!',
      );
      await registerPage.createAccountButton.click();

      // Deve redirecionar para login após registro bem-sucedido
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });

  });
});
