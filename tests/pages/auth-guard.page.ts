import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class AuthGuardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async expectRedirectToLogin(path: string): Promise<void> {
    await this.open(path);
    await expect(this.page).toHaveURL(/\/login/, { timeout: 10000 });
  }
}
