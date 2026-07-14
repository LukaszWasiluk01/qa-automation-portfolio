import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly header: Locator;
  readonly createIssueButton: Locator;
  readonly issueError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByTestId('dashboard-header');
    this.createIssueButton = page.getByTestId('create-issue-button');
    this.issueError = page.getByTestId('issue-error');
  }
}