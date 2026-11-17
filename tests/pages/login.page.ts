import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.page.getByRole('heading', { name: /login|entrar|acessar/i });
  }

  get emailInput(): Locator {
    return this.page.locator('input[type="email"]');
  }

  get passwordInput(): Locator {
    return this.page.locator('input[type="password"]');
  }

  get rememberCheckbox(): Locator {
    return this.page.locator('input[type="checkbox"]');
  }

  get forgotPasswordLink(): Locator {
    return this.page.getByRole('link', { name: /Esqueceu a senha/i });
  }

  get registerLink(): Locator {
    return this.page.getByRole('link', { name: /Cadastre-se/i });
  }

  get homeLink(): Locator {
    return this.page.getByRole('link', { name: /Voltar para o início/i });
  }

  get submitButton(): Locator {
    return this.page.getByRole('button', { name: /Entrar/i });
  }

  async openLogin(): Promise<void> {
    await this.open('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginAsAdmin(): Promise<void> {
    await this.openLogin();
    await this.page.waitForLoadState('networkidle');
    await this.login('admin@flowresolvy.com', 'admin123');
    await expect(this.page).toHaveURL(/\/dashboard/, { timeout: 30000 });
    await this.page.waitForLoadState('networkidle');
  }
}
