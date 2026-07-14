import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"], input[name="email"], #email');
    this.passwordInput = page.locator('input[type="password"], input[name="password"], #password');
    this.loginButton = page.locator('button, input[type="submit"], [role="button"]').filter({ hasText: /Login|Sign in|Submit/i });
    this.errorMessage = page.locator('#error-message, [data-testid="error-message"], [data-testid="error"]');
  }

  async goto() {
    await this.page.goto('/index.html');
  }

  async login(email: string, password: string) {
    await this.emailInput.first().fill(email);
    await this.passwordInput.first().fill(password);
    await this.loginButton.first().click();
  }
}