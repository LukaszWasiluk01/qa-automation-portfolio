import { Page, Locator } from '@playwright/test';

export class IssuesPage {
  readonly page: Page;
  readonly header: Locator;
  readonly userRole: Locator;
  readonly logoutButton: Locator;

  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly prioritySelect: Locator;
  readonly createButton: Locator;
  readonly issueError: Locator;

  readonly table: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByTestId('dashboard-header');
    this.userRole = page.getByTestId('user-role');
    this.logoutButton = page.getByTestId('logout-button');

    this.titleInput = page.getByTestId('issue-title-input');
    this.descriptionInput = page.getByTestId('issue-description-input');
    this.prioritySelect = page.getByTestId('issue-priority-select');
    this.createButton = page.getByTestId('create-issue-button');
    this.issueError = page.getByTestId('issue-error');

    this.table = page.getByTestId('issues-table');
    this.rows = page.getByTestId('issue-row');
  }

  async createIssue(title: string, description = '', priority?: string) {
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    if (priority) {
      await this.prioritySelect.selectOption(priority);
    }
    await this.createButton.click();
  }

  rowByTitle(title: string): Locator {
    return this.rows.filter({ hasText: title });
  }

  viewButtonForTitle(title: string): Locator {
    return this.rowByTitle(title).getByTestId('view-issue-button');
  }

  deleteButtonForTitle(title: string): Locator {
    return this.rowByTitle(title).getByTestId('delete-issue-button');
  }

  async count(): Promise<number> {
    return this.rows.count();
  }

  async logout() {
    await this.logoutButton.click();
  }
}
