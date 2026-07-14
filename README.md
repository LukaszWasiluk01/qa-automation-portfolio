# QA Automation Portfolio - Issue Tracker

[![CI Pipeline](https://github.com/LukaszWasiluk01/qa-automation-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/LukaszWasiluk01/qa-automation-portfolio/actions/workflows/ci.yml)

A Quality Assurance portfolio that demonstrates a full software testing lifecycle (STLC) and modern test automation practices around a custom **Issue Tracker** REST API. It combines manual QA documentation, API testing, SQL validation, backend integration tests and E2E automation, all wired into a green GitHub Actions pipeline.

## Portfolio Highlights

* **Real ASP.NET Core Web API** with JWT authentication and role-based access control (Admin, Tester, Developer).
* **20 xUnit tests** (unit validation + integration tests via `WebApplicationFactory`).
* **21 Playwright + TypeScript tests** organised with the Page Object Model, covering UI, RBAC and the API layer.
* **CI/CD** with GitHub Actions that builds the backend, runs the xUnit suite, starts the API and runs Playwright, then uploads the HTML report as an artifact.
* **Manual QA documentation, a Postman collection and SQL validation queries** for the same application.

## Tech Stack

* **Backend:** ASP.NET Core 8 Web API, C#, Entity Framework Core
* **Database:** SQL Server LocalDB (local) / EF Core In-Memory (tests & CI)
* **Integration testing:** xUnit, `Microsoft.AspNetCore.Mvc.Testing`
* **E2E & API automation:** Playwright, TypeScript, Page Object Model
* **API docs:** Swagger / OpenAPI
* **CI/CD:** GitHub Actions, Node.js 22 LTS

## Repository Structure

```text
qa-automation-portfolio/
├── src/
│   ├── IssueTracker.API/      # ASP.NET Core Web API + minimal web UI (wwwroot)
│   └── IssueTracker.Tests/    # xUnit unit & integration tests
├── e2e/
│   ├── pages/                 # Page Objects (Login, Issues, IssueDetails, Admin)
│   ├── tests/                 # auth / issues / permissions / api specs
│   ├── fixtures/              # users + issue test data
│   └── playwright.config.ts
├── postman/                   # Collection + environment
├── docs/                      # Test plan, test cases, bug reports, risk analysis, exploratory notes
├── sql/                       # Sample validation queries + seed data
├── .github/workflows/ci.yml
└── README.md
```

## API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | – | Register a user |
| POST | `/api/auth/login` | – | Log in, returns a JWT + role |
| GET | `/api/auth/me` | JWT | Current user email + role |
| GET | `/api/issues` | JWT | List issues (`?status=`, `?sort=priority`) |
| GET | `/api/issues/{id}` | JWT | Get a single issue |
| POST | `/api/issues` | JWT | Create an issue |
| PUT | `/api/issues/{id}` | JWT | Update an issue |
| PATCH | `/api/issues/{id}/status` | JWT | Update issue status |
| DELETE | `/api/issues/{id}` | JWT (Admin) | Delete an issue |
| GET | `/health` | – | Liveness probe used by CI |

### Demo accounts (seeded on startup)

| Email | Password | Role |
|---|---|---|
| admin@issuetracker.com | TestPassword123! | Admin |
| tester@issuetracker.com | TestPassword123! | Tester |
| developer@issuetracker.com | TestPassword123! | Developer |

## How to Run Locally

### Prerequisites
* [.NET 8.0 SDK](https://dotnet.microsoft.com/download) (or newer; the projects target `net8.0`)
* [Node.js 22+ LTS](https://nodejs.org/)
* SQL Server Express LocalDB (only for running the API in the `Development` environment; the database is created automatically on first run)

### 1. Start the API
```bash
cd src/IssueTracker.API
dotnet run
```
The API is available at `http://localhost:5141`, Swagger UI at `http://localhost:5141/swagger`, and the demo UI at `http://localhost:5141/`.

### 2. Run the xUnit tests
```bash
dotnet test src/IssueTracker.Tests/IssueTracker.Tests.csproj
```
These use an in-memory database and require no external services.

### 3. Run the Playwright tests
```bash
cd e2e
npm ci
npx playwright install
npm test
```
Playwright starts the API automatically (in the `Testing` environment with an in-memory database) via its `webServer` configuration, so you do **not** need to start the API manually. To view the HTML report:
```bash
npm run report
```

## Continuous Integration

The pipeline in `.github/workflows/ci.yml` runs on every push and pull request to `main`:

1. Restore and build the backend (.NET 8).
2. Run the xUnit unit & integration tests.
3. Install Node.js and the Playwright Chromium browser.
4. Run the Playwright suite (which boots the API against an in-memory database).
5. Upload the Playwright HTML report as a build artifact.

## Testing Scope

* **Manual QA:** test plan, 26 test cases, bug reports, risk analysis and exploratory notes in `docs/`.
* **API testing:** Postman collection with auth flow and automated assertions in `postman/`.
* **SQL validation:** sample queries and seed data in `sql/`.
* **Backend:** xUnit integration tests in `src/IssueTracker.Tests/`.
* **E2E/API automation:** Playwright specs in `e2e/tests/` using Page Objects in `e2e/pages/`.
