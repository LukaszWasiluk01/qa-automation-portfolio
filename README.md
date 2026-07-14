# QA Automation Portfolio - Issue Tracker

[![CI Pipeline](https://github.com/LukaszWasiluk01/qa-automation-portfolio/actions/workflows/ci.yml/badge.svg)]([https://github.com/LukaszWasiluk01/qa-automation-portfolio/actions](https://github.com/LukaszWasiluk01/qa-automation-portfolio/actions))

A comprehensive Quality Assurance portfolio demonstrating a complete software testing lifecycle (STLC) and modern test automation practices. The project features a custom-built Issue Tracker REST API and a fully automated testing pipeline.

## Portfolio Highlights

* **End-to-end QA workflow** from manual test planning to CI automation.
* **Realistic Issue Tracker API** with authentication (JWT) and role-based access control (RBAC).
* **Automated test suite** executed seamlessly in GitHub Actions using InMemory databases.
* **Clear separation of concerns** between manual tests, API tests, SQL validation, and E2E automation (Page Object Model).

## Testing Scope

* **Manual QA documentation:** Test plan, 25+ test cases, bug reports, risk analysis, and exploratory testing notes.
* **API testing:** Postman collection with auth flow and automated test scripts.
* **SQL validation:** Sample queries for checking issue status, users, and data consistency.
* **Backend integration tests:** xUnit + WebApplicationFactory covering core API endpoints.
* **E2E/API automation:** Playwright + TypeScript + Page Object Model testing UI and API layers.
* **CI/CD:** GitHub Actions pipeline running the backend, applying environment configurations, and executing Playwright tests.

## How to Review This Portfolio

Recommended review order for recruiters and technical reviewers:

1. Read `/docs/TEST_PLAN.md` for the overarching test strategy.
2. Check `/docs/TEST_CASES.md` for structured manual test design (25+ scenarios).
3. Review `/postman` for API testing collections.
4. Explore `/e2e/tests` and `/e2e/pages` to evaluate the Playwright automation framework.
5. Check `.github/workflows/ci.yml` for the CI/CD execution flow and active health checks.

## Tech Stack

* **Backend:** ASP.NET Core Web API, C#, Entity Framework Core
* **Database:** SQL Server LocalDB / In-Memory DB (CI)
* **Integration Testing:** xUnit, WebApplicationFactory
* **E2E & UI Automation:** Playwright, TypeScript, POM
* **CI/CD:** GitHub Actions, Node.js 22 LTS

## How to Run Locally

### Prerequisites
* [.NET 8.0 SDK](https://dotnet.microsoft.com/download)
* [Node.js 22+ LTS](https://nodejs.org/)
* SQL Server Express LocalDB (installed via Visual Studio)

### 1. Start the API
```bash
cd src/IssueTracker.API
dotnet run
```
*The API will be available at http://localhost:5141 and Swagger UI at http://localhost:5141/swagger.*

### 2. Run xUnit Integration Tests
```bash
cd src/IssueTracker.Tests
dotnet test
```

### 3. Run Playwright E2E Tests
*Ensure the API is running before executing these tests.*
```bash
cd e2e
npm ci
npx playwright install
npm test
```
*To view the HTML report:*
```bash
npm run report
```