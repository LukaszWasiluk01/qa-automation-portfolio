import { test, expect } from '@playwright/test';

test.describe('Authentication & Dashboard UI', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Successful login and redirect to dashboard', async ({ page }) => {
    await page.getByTestId('email-input').fill('admin@issuetracker.com');
    await page.getByTestId('password-input').fill('TestPassword123!');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('dashboard-header')).toBeVisible();
  });

  test('Login fails with invalid password', async ({ page }) => {
    await page.getByTestId('email-input').fill('admin@issuetracker.com');
    await page.getByTestId('password-input').fill('WrongPassword!');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error-message')).toHaveText('Invalid credentials');
  });

  test('Create issue fails with empty title', async ({ page }) => {
    await page.getByTestId('email-input').fill('admin@issuetracker.com');
    await page.getByTestId('password-input').fill('TestPassword123!');
    await page.getByTestId('login-button').click();

    await page.getByTestId('create-issue-button').click();

    await expect(page.getByTestId('issue-error')).toHaveText('Title is required');
  });

});