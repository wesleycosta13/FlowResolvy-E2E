import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { LoginPage } from './login.page';

export class TicketsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.page.getByRole('heading', { name: /Chamados/i });
  }

  get newTicketButton(): Locator {
    return this.page.getByRole('button', { name: /Novo Chamado/i });
  }

  get searchInput(): Locator {
    return this.page.locator('input[placeholder*="Buscar"]');
  }

  get table(): Locator {
    return this.page.locator('table');
  }

  get rows(): Locator {
    return this.page.locator('table tbody tr');
  }

  get statusFilter(): Locator {
    return this.page.locator('select').filter({ hasText: /Todos os Status|Status/i });
  }

  get priorityFilter(): Locator {
    return this.page.locator('select').filter({ hasText: /Todas as Prioridades|Prioridade/i });
  }

  get titleInput(): Locator {
    return this.page.locator('input[placeholder*="Título"]');
  }

  get descriptionInput(): Locator {
    return this.page.locator('textarea');
  }

  get prioritySelect(): Locator {
    return this.page.locator('select').filter({ hasText: /Baixa|Média|Alta|Crítica/i });
  }

  get categorySelect(): Locator {
    return this.page.locator('select').filter({ hasText: /Suporte Técnico|Financeiro/i });
  }

  get cancelButton(): Locator {
    return this.page.getByRole('button', { name: /Cancelar/i });
  }

  get createTicketButton(): Locator {
    return this.page.getByRole('button', { name: /Criar Chamado/i });
  }

  get saveChangesButton(): Locator {
    return this.page.getByRole('button', { name: /Salvar Alterações/i });
  }

  async openTickets(): Promise<void> {
    await this.open('/tickets');
  }

  async loginAndOpenTickets(): Promise<void> {
    await new LoginPage(this.page).loginAsAdmin();
    await this.openTickets();
  }

  async startNewTicket(): Promise<void> {
    await this.newTicketButton.click();
  }

  firstRow(): Locator {
    return this.rows.first();
  }

  async fillNewTicket(title: string, description: string): Promise<void> {
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.prioritySelect.selectOption({ label: 'Alta' });
    await this.categorySelect.selectOption({ label: 'Suporte Técnico' });
  }
}
