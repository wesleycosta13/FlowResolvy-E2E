import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';

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
    await expect(loginPage.emailInput).toHaveAttribute('placeholder', /email/i);
    await expect(loginPage.passwordInput).toHaveAttribute('placeholder', /••••/);
  });

  test('deve exibir checkbox Lembrar de mim', async ({ page }) => {
    await expect(loginPage.getByText('Lembrar de mim')).toBeVisible();
    await expect(loginPage.rememberCheckbox).toBeVisible();
  });

  test('deve exibir link Esqueceu a senha', async ({ page }) => {
    await expect(loginPage.forgotPasswordLink).toBeVisible();
  });

  test('link Esqueceu a senha deve navegar para /forgot-password', async ({ page }) => {
    await loginPage.forgotPasswordLink.click();
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test('deve exibir link para cadastro', async ({ page }) => {
    await expect(loginPage.getByText(/Não tem conta/i)).toBeVisible();
    await expect(loginPage.registerLink).toBeVisible();
  });

  test('link Cadastre-se deve navegar para /register', async ({ page }) => {
    await loginPage.registerLink.click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('deve exibir link Voltar para o início', async ({ page }) => {
    await expect(loginPage.homeLink).toBeVisible();
  });

  test('link Voltar para o início deve navegar para /', async ({ page }) => {
    await loginPage.homeLink.click();
    await expect(page).toHaveURL(/\/$/);
  });

  test.describe('Validação de Login', () => {
    test('deve exibir erro ao submeter formulário vazio', async ({ page }) => {
      await loginPage.submitButton.click();
      
      // Pode ser validação HTML5 ou mensagem customizada
      const errorMsg = loginPage.getByText(/Credenciais inválidas|Preencha/i);
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    });

    test('deve exibir erro com credenciais inválidas', async ({ page }) => {
      await loginPage.login('invalido@email.com', 'senhaerrada');

      await expect(loginPage.getByText(/Credenciais inválidas/i)).toBeVisible({ timeout: 5000 });
    });

    test('deve fazer login com sucesso usando credenciais válidas', async ({ page }) => {
      await loginPage.login('admin@flowresolvy.com', 'admin123');

      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    });
  });

  test('checkbox Lembrar de mim deve ser clicável', async ({ page }) => {
    const checkbox = loginPage.rememberCheckbox;
    await expect(checkbox).not.toBeChecked();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  });
});
