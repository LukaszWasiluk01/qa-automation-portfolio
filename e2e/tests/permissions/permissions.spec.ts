import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IssuesPage } from '../../pages/IssuesPage';
import { AdminPage } from '../../pages/AdminPage';
import { users } from '../../fixtures/users';

test.describe('Role-based access control', () => {
  test('an admin sees delete controls on issues', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const issuesPage = new IssuesPage(page);
    const adminPage = new AdminPage(page);

    await loginPage.goto();
    await loginPage.login(users.admin.email, users.admin.password);
    await expect(issuesPage.header).toBeVisible();

    expect(await adminPage.deleteButtonCount()).toBeGreaterThan(0);
  });

  test('a tester does not see any delete controls', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const issuesPage = new IssuesPage(page);
    const adminPage = new AdminPage(page);

    await loginPage.goto();
    await loginPage.login(users.tester.email, users.tester.password);
    await expect(issuesPage.header).toBeVisible();
    await expect(issuesPage.rows.first()).toBeVisible();

    expect(await adminPage.deleteButtonCount()).toBe(0);
  });

  test('a developer does not see any delete controls', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const issuesPage = new IssuesPage(page);
    const adminPage = new AdminPage(page);

    await loginPage.goto();
    await loginPage.login(users.developer.email, users.developer.password);
    await expect(issuesPage.header).toBeVisible();
    await expect(issuesPage.rows.first()).toBeVisible();

    expect(await adminPage.deleteButtonCount()).toBe(0);
  });

  test('a tester is forbidden from deleting an issue via the API', async ({ request }) => {
    const adminLogin = await request.post('/api/auth/login', {
      data: { email: users.admin.email, password: users.admin.password }
    });
    const adminToken = (await adminLogin.json()).token;

    const created = await request.post('/api/issues', {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: { title: 'RBAC protected issue', priority: 1 }
    });
    const issueId = (await created.json()).id;

    const testerLogin = await request.post('/api/auth/login', {
      data: { email: users.tester.email, password: users.tester.password }
    });
    const testerToken = (await testerLogin.json()).token;

    const deleteResponse = await request.delete(`/api/issues/${issueId}`, {
      headers: { Authorization: `Bearer ${testerToken}` }
    });

    expect(deleteResponse.status()).toBe(403);
  });
});
