# QA Automation Portfolio - Issue Tracker

[![CI Pipeline](https://github.com/LukaszWasiluk01/qa-automation-portfolio/actions/workflows/ci.yml/badge.svg)]([https://github.com/LukaszWasiluk01/qa-automation-portfolio/actions](https://github.com/LukaszWasiluk01/qa-automation-portfolio/actions))

A comprehensive Quality Assurance portfolio demonstrating a complete software testing lifecycle (STLC) and modern test automation practices. The project features a custom-built Issue Tracker REST API and a fully automated testing pipeline.

## 🎯 Skills Demonstrated

*   **Manual test design and documentation** (Test Plans, Test Cases, Bug Reports, Exploratory Notes)
*   **API testing** with Postman and Playwright
*   **UI automation** with Playwright and TypeScript
*   **Design Patterns:** Page Object Model (POM) and Data Isolation (Fixtures)
*   **Backend integration testing** with xUnit & WebApplicationFactory
*   **SQL** test data validation
*   **CI/CD** with GitHub Actions (Dynamic Environment configurations, Health Checks, Artifacts)

## 📊 Test Coverage

This portfolio covers:
*   **Authentication scenarios:** valid login, invalid login, authorization checks.
*   **API Tests:** Issue CRUD operations through direct endpoints.
*   **UI Smoke Tests:** Core user flows via browser.
*   **Integration Tests:** Backend .NET endpoints validation.
*   **Database:** SQL validation queries for test data verification.

## 🧭 How to Review This Portfolio

Recommended review order for recruiters and technical reviewers:
1.  Read `/docs/TEST_PLAN.md` for the overarching test strategy.
2.  Check `/docs/TEST_CASES.md` for structured manual test design.
3.  Review `/postman` for API testing collections.
4.  Explore `/e2e/tests` and `/e2e/pages` to evaluate the Playwright automation framework.
5.  Check `.github/workflows/ci.yml` for the CI/CD execution flow and environment management.

## 🛠️ Tech Stack

*   **Backend:** ASP.NET Core Web API, C#, Entity Framework Core
*   **Database:** SQL Server LocalDB / In-Memory DB (CI)
*   **Integration Testing:** xUnit, WebApplicationFactory
*   **E2E & UI Automation:** Playwright, TypeScript, Page Object Model (POM)
*   **API Testing:** Postman, Playwright API Requests
*   **CI/CD:** GitHub Actions

## 🚀 How to Run Locally

### Prerequisites
*   [.NET 8.0 SDK](https://dotnet.microsoft.com/download)
*   [Node.js 22+ LTS](https://nodejs.org/)
*   SQL Server Express LocalDB (installed via Visual Studio)

### 1. Start the API
```bash
cd src/IssueTracker.API
dotnet run
```
*The API will be available at `http://localhost:5141` and Swagger UI at `http://localhost:5141/swagger`.*

### 2. Run xUnit Integration Tests
```bash
cd src/IssueTracker.Tests
dotnet test
```

### 3. Run Playwright E2E Tests
*Ensure the API is running in the background before executing these tests.*
```bash
cd e2e
npm ci
npx playwright install
npm test
```
*To view the HTML report after tests finish:*
```bash
npm run report
```