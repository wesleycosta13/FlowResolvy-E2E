import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { LoginPage } from './login.page';

export class SettingsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.page.getByRole('heading', { name: /Configurações/i });
  }

  get profileTab(): Locator {
    return this.page.getByRole('button', { name: /Perfil/i }).or(this.page.getByRole('tab', { name: /Perfil/i }));
  }

  get notificationsTab(): Locator {
    return this.page.getByRole('button', { name: /Notificações/i }).or(this.page.getByRole('tab', { name: /Notificações/i }));
  }

  get securityTab(): Locator {
    return this.page.getByRole('button', { name: /Segurança/i }).or(this.page.getByRole('tab', { name: /Segurança/i }));
  }

  get emailInput(): Locator {
    return this.page.locator('input[type="email"]');
  }

  get textInputs(): Locator {
    return this.page.locator('input[type="text"]');
  }

  get departmentSelect(): Locator {
    return this.page.locator('select').filter({ hasText: /TI|Suporte|Comercial/i });
  }

  get passwordInputs(): Locator {
    return this.page.locator('input[type="password"]');
  }

  async loginAndOpenSettings(): Promise<void> {
    await new LoginPage(this.page).loginAsAdmin();
    await this.open('/settings');
  }
}
