import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IssuesPage } from '../../pages/IssuesPage';
import { users } from '../../fixtures/users';

test.describe('Authentication', () => {
  let loginPage: LoginPage;
  let issuesPage: IssuesPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    issuesPage = new IssuesPage(page);
    await loginPage.goto();
  });

  test('successful login shows the dashboard and the user role', async () => {
    await loginPage.login(users.admin.email, users.admin.password);

    await expect(issuesPage.header).toBeVisible();
    await expect(issuesPage.userRole).toHaveText('Admin');
  });

  test('login fails with an invalid password', async () => {
    await loginPage.login(users.admin.email, 'WrongPassword!');

    await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
    await expect(issuesPage.header).toBeHidden();
  });

  test('login fails with an unregistered email', async () => {
    await loginPage.login(users.invalid.email, users.invalid.password);

    await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
  });

  test('login is blocked when fields are empty', async () => {
    await loginPage.login('', '');

    await expect(loginPage.errorMessage).toHaveText('Email and password are required');
    await expect(issuesPage.header).toBeHidden();
  });

  test('logout returns the user to the login screen', async () => {
    await loginPage.login(users.tester.email, users.tester.password);
    await expect(issuesPage.header).toBeVisible();

    await issuesPage.logout();

    await expect(loginPage.loginSection).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
