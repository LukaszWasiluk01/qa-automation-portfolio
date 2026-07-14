# QA Automation Portfolio - Issue Tracker

[![CI Pipeline](https://github.com/LukaszWasiluk01/qa-automation-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/LukaszWasiluk01/qa-automation-portfolio/actions)

A comprehensive Quality Assurance portfolio demonstrating a complete software testing lifecycle (STLC) and modern test automation practices. The project features a custom-built Issue Tracker REST API and a fully automated testing pipeline.

## Tech Stack

*   **Backend:** ASP.NET Core Web API, C#, Entity Framework Core
*   **Database:** SQL Server LocalDB
*   **Integration Testing:** xUnit, WebApplicationFactory
*   **E2E & UI Automation:** Playwright, TypeScript, Page Object Model (POM)
*   **API Testing:** Postman, Playwright API Requests
*   **CI/CD:** GitHub Actions

## Project Structure

*   `/docs` - Comprehensive QA documentation (Test Plan, Test Cases, Bug Reports, Risk Analysis, Exploratory Notes).
*   `/src` - Source code for the ASP.NET Core backend and xUnit integration tests.
*   `/e2e` - Playwright automation framework (UI & API tests) implementing the Page Object Model pattern.
*   `/postman` - API testing collections and environment configurations.
*   `/sql` - Test data seeding scripts and sample validation queries.
*   `.github/workflows` - CI/CD pipeline configuration.

## How to Run Locally

### Prerequisites
*   [.NET 8.0 SDK](https://dotnet.microsoft.com/download)
*   [Node.js 24+](https://nodejs.org/)
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
npm install
npx playwright install
npx playwright test
```

## CI/CD Pipeline
This project uses GitHub Actions for continuous integration. On every push to the `main` branch, the pipeline automatically:
1. Builds the .NET backend.
2. Executes xUnit integration tests.
3. Provisions a Playwright environment.
4. Starts the API server in the background.
5. Executes the E2E UI and API test suite.
6. Uploads the HTML test report as a workflow artifact.