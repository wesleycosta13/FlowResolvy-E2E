import { type Locator, type Page } from '@playwright/test';
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

  get registerLink(): Locator {
    return this.page.getByRole('link', { name: /Cadastrar minha empresa/i });
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

}
