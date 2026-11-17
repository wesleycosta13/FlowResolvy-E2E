import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { credentialsRequired, hasTestCredentials, testCredentials } from './helpers/auth';

test.describe('Página de Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.openLogin();
  });

  test('deve carregar a página de login corretamente', async ({ page }) => {
    await expect(loginPage.heading).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test('deve exibir campos de email e senha com placeholders', async ({ page }) => {
    await expect(loginPage.emailInput).toHaveAttribute('placeholder', 'seu@email.com');
    await expect(loginPage.passwordInput).toHaveAttribute('placeholder', 'Digite sua senha');
  });

  test.skip('recuperação de senha deve navegar para /forgot-password', async () => {
    test.skip(true, 'Funcionalidade de recuperação de senha indisponível no momento.');
  });

  test('deve exibir o link para cadastrar uma empresa', async () => {
    await expect(loginPage.registerLink).toBeVisible();
  });

  test('link de cadastro deve navegar para /register', async ({ page }) => {
    await loginPage.registerLink.click();
    await expect(page).toHaveURL(/\/register/);
  });

  test.describe('Validação de Login', () => {
    test('deve exigir email e senha', async () => {
      expect(await loginPage.emailInput.evaluate((input: HTMLInputElement) => input.required)).toBe(true);
      expect(await loginPage.passwordInput.evaluate((input: HTMLInputElement) => input.required)).toBe(true);
    });

    test('deve exibir erro com credenciais inválidas', async ({ page }) => {
      await loginPage.login('invalido@email.com', 'senhaerrada');

      await expect(loginPage.getByText(/E-mail ou senha inválidos/i)).toBeVisible({ timeout: 10000 });
    });

    test('deve fazer login com sucesso usando credenciais válidas', async ({ page }) => {
      test.skip(!hasTestCredentials, credentialsRequired);
      await loginPage.login(testCredentials.email, testCredentials.password);

      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    });
  });

});
