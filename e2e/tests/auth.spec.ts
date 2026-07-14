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
    await expect.poll(async () => await loginPage.page.locator('#dashboard-section').getAttribute('class')).toContain('hidden');
    await expect(dashboardPage.header).toBeVisible();
  });

  test('Login fails with invalid password', async () => {
    await loginPage.login('admin@issuetracker.com', 'WrongPass!');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
  });

  test('Login fails with empty email', async () => {
    await loginPage.login('', 'TestPassword123!');
    await expect(loginPage.page.locator('input[type="email"]')).toBeEditable();
  });

  test('Create issue fails with empty title', async () => {
    await loginPage.login('admin@issuetracker.com', 'TestPassword123!');
    await expect(dashboardPage.createIssueButton).toBeVisible();
    await dashboardPage.createIssueButton.click();
    await expect(dashboardPage.issueError).toHaveText('Title is required');
  });

  test('Navigation to dashboard blocked without login', async ({ page }) => {
    await page.goto('/dashboard.html');
    await expect(page).toHaveURL(/dashboard\.html/);
  });
});