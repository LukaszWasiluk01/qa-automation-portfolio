import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Authentication & Dashboard UI', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.goto();
  });

  test('Successful login and redirect to dashboard', async () => {
    await loginPage.login('admin@issuetracker.com', 'TestPassword123!');
    await expect(dashboardPage.header).toBeVisible();
  });

  test('Login fails with invalid password', async () => {
    await loginPage.login('admin@issuetracker.com', 'WrongPassword!');
    await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
  });

  test('Create issue fails with empty title', async () => {
    await loginPage.login('admin@issuetracker.com', 'TestPassword123!');
    await dashboardPage.createIssueButton.click();
    await expect(dashboardPage.issueError).toHaveText('Title is required');
  });
});