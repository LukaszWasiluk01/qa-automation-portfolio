import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:5141';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  // Automatically start the ASP.NET Core API before the tests. Locally an
  // already-running instance is reused; in CI a fresh server is started.
  webServer: {
    command:
      'dotnet run --project ../src/IssueTracker.API/IssueTracker.API.csproj --no-launch-profile --urls http://localhost:5141',
    url: 'http://localhost:5141/health',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    // Force the Testing environment so the API uses the in-memory database
    // instead of SQL Server. Setting it via the process env is reliable across
    // OSes, unlike passing --environment through `dotnet run`.
    env: {
      ASPNETCORE_ENVIRONMENT: 'Testing',
    },
    stdout: 'pipe',
    stderr: 'pipe',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // In CI we only run Chromium to keep the pipeline fast.
    // Firefox and WebKit run locally only.
    ...(process.env.CI
      ? []
      : [
          {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
          },
          {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
          },
        ]),
  ],
});
