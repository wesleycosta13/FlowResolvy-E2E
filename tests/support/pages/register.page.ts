import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.page.getByRole('heading', { name: /cadastr|registr|criar conta/i });
  }

  get companyNameInput(): Locator {
    return this.page.getByPlaceholder('Ex: Minha Empresa Ltda');
  }

  get ownerNameInput(): Locator {
    return this.page.getByPlaceholder('Ex: João Silva');
  }

  get cpfCnpjInput(): Locator {
    return this.page.getByPlaceholder('CPF ou CNPJ');
  }

  get phoneInput(): Locator {
    return this.page.getByPlaceholder('(11) 99999-9999');
  }

  get emailInput(): Locator {
    return this.page.locator('input[type="email"]');
  }

  get passwordInputs(): Locator {
    return this.page.locator('input[type="password"]');
  }

  get createAccountButton(): Locator {
    return this.page.getByRole('button', { name: /Criar conta gratuita/i });
  }

  get loginLink(): Locator {
    return this.page.getByRole('link', { name: 'Entrar', exact: true });
  }

  async fillRegistration(
    companyName: string,
    ownerName: string,
    cpfCnpj: string,
    phone: string,
    email: string,
    password: string,
  ): Promise<void> {
    await this.companyNameInput.fill(companyName);
    await this.ownerNameInput.fill(ownerName);
    await this.cpfCnpjInput.fill(cpfCnpj);
    await this.phoneInput.fill(phone);
    await this.emailInput.fill(email);
    await this.passwordInputs.nth(0).fill(password);
    await this.passwordInputs.nth(1).fill(password);
  }

  async openRegister(): Promise<void> {
    await this.open('/register');
  }

}
