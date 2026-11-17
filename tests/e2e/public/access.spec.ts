import { test, expect } from '@playwright/test';

test.describe('Acesso público', () => {
  test('rota inicial deve encaminhar para login', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Entrar na sua conta' })).toBeVisible();
  });

  test('login deve apresentar a plataforma e o formulário de acesso', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', {
      name: 'Organize seu atendimento, encante seus clientes.',
    })).toBeVisible();
    await expect(page.getByText('Plataforma multi-tenant para empresas brasileiras.')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'seu@email.com' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Digite sua senha' })).toBeVisible();
  });

  test('link de cadastro deve abrir o formulário da empresa', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Cadastrar minha empresa' }).click();

    await expect(page).toHaveURL(/\/register$/);
    await expect(page.getByRole('heading', { name: 'Cadastre sua empresa' })).toBeVisible();
  });
});
