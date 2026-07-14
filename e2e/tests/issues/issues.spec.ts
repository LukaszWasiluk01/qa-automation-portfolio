import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IssuesPage } from '../../pages/IssuesPage';
import { IssueDetailsPage } from '../../pages/IssueDetailsPage';
import { users } from '../../fixtures/users';
import { uniqueTitle } from '../../fixtures/issueData';

test.describe('Issue management (UI CRUD)', () => {
  let loginPage: LoginPage;
  let issuesPage: IssuesPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    issuesPage = new IssuesPage(page);
    await loginPage.goto();
    await loginPage.login(users.admin.email, users.admin.password);
    await expect(issuesPage.header).toBeVisible();
  });

  test('the seeded issue list is visible after login', async () => {
    await expect(issuesPage.table).toBeVisible();
    expect(await issuesPage.count()).toBeGreaterThan(0);
  });

  test('a new issue can be created and appears in the list', async () => {
    const title = uniqueTitle('Create');

    await issuesPage.createIssue(title, 'Created by E2E test', '2');

    await expect(issuesPage.rowByTitle(title)).toBeVisible();
  });

  test('creating an issue without a title shows a validation error', async () => {
    await issuesPage.createIssue('', 'No title provided');

    await expect(issuesPage.issueError).toHaveText('Title is required');
  });

  test('creating an issue increases the number of rows', async () => {
    const title = uniqueTitle('Counter');
    const before = await issuesPage.count();

    await issuesPage.createIssue(title, 'row count test');

    await expect(issuesPage.rowByTitle(title)).toBeVisible();
    expect(await issuesPage.count()).toBeGreaterThan(before);
  });

  test('a created issue starts with the Open status', async () => {
    const title = uniqueTitle('Status');

    await issuesPage.createIssue(title, 'status check');

    const statusCell = issuesPage.rowByTitle(title).getByTestId('issue-status-cell');
    await expect(statusCell).toHaveText('Open');
  });

  test('the issue details view shows the correct title', async ({ page }) => {
    const detailsPage = new IssueDetailsPage(page);
    const title = uniqueTitle('Details');

    await issuesPage.createIssue(title, 'details body');
    await issuesPage.viewButtonForTitle(title).click();

    await expect(detailsPage.card).toBeVisible();
    await expect(detailsPage.title).toHaveText(title);
    await expect(detailsPage.status).toHaveText('Open');
  });
});
