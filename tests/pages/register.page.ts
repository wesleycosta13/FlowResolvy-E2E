import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.page.getByRole('heading', { name: /cadastr|registr|criar conta/i });
  }

  get nameInput(): Locator {
    return this.page.locator('input[placeholder*="nome" i]');
  }

  get emailInput(): Locator {
    return this.page.locator('input[type="email"]');
  }

  get passwordInputs(): Locator {
    return this.page.locator('input[type="password"]');
  }

  get termsCheckbox(): Locator {
    return this.page.locator('input[type="checkbox"]');
  }

  get createAccountButton(): Locator {
    return this.page.getByRole('button', { name: /Criar Conta/i });
  }

  get loginLink(): Locator {
    return this.page.getByRole('link', { name: /login|Faça login/i });
  }

  get homeLink(): Locator {
    return this.page.getByRole('link', { name: /Voltar para o início/i });
  }

  async openRegister(): Promise<void> {
    await this.open('/register');
  }

  async fillRegistration(name: string, email: string, password: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInputs.nth(0).fill(password);
    await this.passwordInputs.nth(1).fill(password);
    await this.termsCheckbox.check();
  }
}
