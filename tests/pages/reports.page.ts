import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { LoginPage } from './login.page';

export class ReportsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.page.getByRole('heading', { name: /Relatórios/i });
  }

  get periodSelect(): Locator {
    return this.page.locator('select').filter({ hasText: /7 dias|30 dias|90 dias/i });
  }

  get exportPdfButton(): Locator {
    return this.page.getByRole('button', { name: /Exportar PDF/i });
  }

  get table(): Locator {
    return this.page.locator('table');
  }

  async loginAndOpenReports(): Promise<void> {
    await new LoginPage(this.page).loginAsAdmin();
    await this.open('/reports');
  }
}
