import { Page, Locator } from '@playwright/test';

export class IssueDetailsPage {
  readonly page: Page;
  readonly card: Locator;
  readonly title: Locator;
  readonly description: Locator;
  readonly status: Locator;
  readonly priority: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.card = page.getByTestId('issue-details');
    this.title = page.getByTestId('details-title');
    this.description = page.getByTestId('details-description');
    this.status = page.getByTestId('details-status');
    this.priority = page.getByTestId('details-priority');
    this.closeButton = page.getByTestId('close-details-button');
  }

  async close() {
    await this.closeButton.click();
  }
}
