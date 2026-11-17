import { test, expect } from '@playwright/test';

test.describe.skip('Recuperação de senha (aguardando implementação)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password');
  });

  test('deve carregar a página corretamente', async ({ page }) => {
    await expect(page.getByText(/Recuperar|Esqueceu|Redefinir/i)).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('deve exibir campo de email com placeholder', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('placeholder', /email/i);
  });

  test('deve exibir botão de envio', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Enviar Link|Recuperar/i })).toBeVisible();
  });

  test('deve exibir link Voltar para o login', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Voltar para o login/i })).toBeVisible();
  });

  test('link Voltar para o login deve navegar para /login', async ({ page }) => {
    await page.getByRole('link', { name: /Voltar para o login/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('deve exibir link Voltar para o início', async ({ page }) => {
    const backLink = page.getByRole('link', { name: /Voltar para o início/i });
    await expect(backLink).toBeVisible();
  });

  test('deve exibir mensagem de sucesso ao enviar email', async ({ page }) => {
    await page.locator('input[type="email"]').fill('recuperacao@example.invalid');
    await page.getByRole('button', { name: /Enviar Link|Recuperar/i }).click();

    await expect(page.getByText(/email estiver cadastrado|link de recuperação/i)).toBeVisible({ timeout: 5000 });
  });

  test('deve exibir mensagem mesmo com email não cadastrado', async ({ page }) => {
    await page.locator('input[type="email"]').fill('naoexiste@email.com');
    await page.getByRole('button', { name: /Enviar Link|Recuperar/i }).click();

    // Por segurança, deve exibir a mesma mensagem genérica
    await expect(page.getByText(/email estiver cadastrado|link de recuperação/i)).toBeVisible({ timeout: 5000 });
  });
});
