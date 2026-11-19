import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
import path from 'node:path';

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

export default async function globalSetup(): Promise<void> {
  if (
    process.env.E2E_TEST_EMAIL &&
    process.env.E2E_TEST_PASSWORD
  ) {
    return;
  }

  const timestamp = Date.now();
  const email = `e2e${timestamp}@example.invalid`;
  const password = 'SenhaForte123!';
  const baseURL =
    process.env.E2E_BASE_URL ?? 'https://flowresolvy.onrender.com';
  const browser = await chromium.launch();
  const page = await browser.newPage({ baseURL });

  await page.goto('/register');
  await page.getByPlaceholder('Ex: Minha Empresa Ltda').fill(`Empresa E2E ${timestamp}`);
  await page.getByPlaceholder('Ex: João Silva').fill(`Teste E2E ${timestamp}`);
  await page.getByPlaceholder('CPF ou CNPJ').fill(createCnpj(timestamp));
  await page.getByPlaceholder('(11) 99999-9999').fill(`119${String(timestamp).slice(-8)}`);
  await page.locator('input[type="email"]').fill(email);
  const passwordInputs = page.locator('input[type="password"]');
  await passwordInputs.nth(0).fill(password);
  await passwordInputs.nth(1).fill(password);
  await page.getByRole('button', { name: /Criar conta gratuita/i }).click();

  await expect(page).toHaveURL(/\/dashboard/, { timeout: 30000 });
  await browser.close();

  const credentialsPath = path.join(process.cwd(), 'test-results', 'e2e-auth.json');
  await mkdir(path.dirname(credentialsPath), { recursive: true });
  await writeFile(credentialsPath, JSON.stringify({ email, password }), 'utf8');

  process.env.E2E_TEST_EMAIL = email;
  process.env.E2E_TEST_PASSWORD = password;
}
