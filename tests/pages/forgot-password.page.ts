import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ForgotPasswordPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.page.getByText(/Recuperar|Esqueceu|Redefinir/i);
  }

  get emailInput(): Locator {
    return this.page.locator('input[type="email"]');
  }

  get submitButton(): Locator {
    return this.page.getByRole('button', { name: /Enviar Link|Recuperar/i });
  }

  get loginLink(): Locator {
    return this.page.getByRole('link', { name: /Voltar para o login/i });
  }

  get homeLink(): Locator {
    return this.page.getByRole('link', { name: /Voltar para o início/i });
  }

  get confirmationMessage(): Locator {
    return this.page.getByText(/email estiver cadastrado|link de recuperação/i);
  }

  async openForgotPassword(): Promise<void> {
    await this.open('/forgot-password');
  }

  async requestReset(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}
