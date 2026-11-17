import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../support/pages/register.page';

function createCnpj(timestamp: number): string {
  const base = String(timestamp).slice(-12).padStart(12, '0');
  const checkDigit = (digits: string, weights: number[]): number => {
    const sum = [...digits].reduce(
      (total, digit, index) => total + Number(digit) * weights[index],
      0,
    );
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };
  const firstDigit = checkDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const secondDigit = checkDigit(
    `${base}${firstDigit}`,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  return `${base}${firstDigit}${secondDigit}`;
}

test.describe('Cadastro de empresa', () => {
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
    await expect(page.getByText(/Já tem uma conta/i)).toBeVisible();
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

    test('deve registrar com sucesso e redirecionar para o dashboard', async ({ page }) => {
      const timestamp = Date.now();

      await registerPage.fillRegistration(
        `Empresa E2E ${timestamp}`,
        `Teste E2E ${timestamp}`,
        createCnpj(timestamp),
        `11${9}${String(timestamp).slice(-8)}`,
        `teste${timestamp}@example.invalid`,
        'SenhaForte123!',
      );
      await registerPage.createAccountButton.click();

      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    });

  });
});
