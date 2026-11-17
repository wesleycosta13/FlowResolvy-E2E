import type { Locator, Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async open(path: string): Promise<void> {
    await this.page.goto(path);
  }

  locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  get url(): string {
    return this.page.url();
  }

  getByText(text: string | RegExp, options?: { exact?: boolean }): Locator {
    return this.page.getByText(text, options);
  }

  getByRole(
    role: Parameters<Page['getByRole']>[0],
    options?: Parameters<Page['getByRole']>[1],
  ): Locator {
    return this.page.getByRole(role, options);
  }
}
