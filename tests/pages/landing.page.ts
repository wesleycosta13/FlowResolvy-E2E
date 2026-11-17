import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LandingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get header(): Locator {
    return this.page.locator('header');
  }

  get footer(): Locator {
    return this.page.locator('footer');
  }

  get contactSection(): Locator {
    return this.page.locator('#contato');
  }

  get plansSection(): Locator {
    return this.page.locator('#planos');
  }

  get featuresSection(): Locator {
    return this.page.locator('#recursos');
  }

  get headline(): Locator {
    return this.page.getByText('Gerencie seus chamados com inteligência e eficiência');
  }

  get loginLink(): Locator {
    return this.header.getByRole('link', { name: /Entrar/i });
  }

  get startFreeLinks(): Locator {
    return this.header.getByRole('link', { name: /Começar Grátis/i });
  }

  get demoLink(): Locator {
    return this.page.getByRole('link', { name: /Ver Demonstração/i });
  }

  contactInput(placeholder: string): Locator {
    return this.contactSection.locator(`input[placeholder*="${placeholder}"]`);
  }

  get contactSelect(): Locator {
    return this.contactSection.locator('select');
  }

  get contactTextarea(): Locator {
    return this.contactSection.locator('textarea');
  }

  get contactSubmitButton(): Locator {
    return this.contactSection.getByRole('button', { name: /Enviar Mensagem/i });
  }
}
