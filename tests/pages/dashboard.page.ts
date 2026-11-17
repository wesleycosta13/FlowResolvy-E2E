import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { LoginPage } from './login.page';

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get welcomeMessage(): Locator {
    return this.page.getByText(/Bem-vindo de volta/i);
  }

  get adminWelcomeMessage(): Locator {
    return this.page.getByText(/Bem-vindo de volta, Admin/i);
  }

  get subtitle(): Locator {
    return this.page.getByText(/resumo dos seus chamados/i);
  }

  get sidebar(): Locator {
    return this.page.locator('aside, nav');
  }

  get ticketsLink(): Locator {
    return this.page.getByRole('link', { name: /Chamados/i });
  }

  get reportsLink(): Locator {
    return this.page.getByRole('link', { name: /Relatórios/i });
  }

  get settingsLink(): Locator {
    return this.page.getByRole('link', { name: /Configurações/i });
  }

  get dashboardLink(): Locator {
    return this.page.getByRole('link', { name: /Dashboard/i });
  }

  get logoutButton(): Locator {
    return this.page.getByRole('button', { name: /Sair/i });
  }

  get table(): Locator {
    return this.page.locator('table');
  }

  get ticketRows(): Locator {
    return this.page.locator('table tbody tr');
  }

  get viewAllTicketsLink(): Locator {
    return this.page.getByRole('link', { name: /Ver todos os chamados/i });
  }

  async loginAsAdmin(): Promise<void> {
    await new LoginPage(this.page).loginAsAdmin();
  }

  async openDashboard(): Promise<void> {
    await this.open('/dashboard');
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
    await expect(this.page).toHaveURL(/\/login/, { timeout: 10000 });
  }
}
