import { Page, Locator } from '@playwright/test';

/**
 * Encapsulates admin-only capabilities in the UI. Delete controls are only
 * rendered for users whose JWT role resolves to "Admin", so this page object
 * is used by the permission/RBAC specs.
 */
export class AdminPage {
  readonly page: Page;
  readonly roleBadge: Locator;
  readonly deleteButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.roleBadge = page.getByTestId('user-role');
    this.deleteButtons = page.getByTestId('delete-issue-button');
  }

  async deleteButtonCount(): Promise<number> {
    return this.deleteButtons.count();
  }
}
