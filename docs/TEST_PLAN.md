# Test Plan: Issue Tracker Application

## 1. Introduction
The purpose of this document is to define the testing strategy, scope, and approach for the **Issue Tracker** application. This project is a web-based system allowing users to manage tasks and bugs with role-based access control.

## 2. Scope
### 2.1. In Scope
The following areas and functionalities will be tested:
*   **Authentication & Authorization:** User registration, login via JWT, and role-based permissions (Admin, Tester, Developer).
*   **Issue Management (CRUD):** Creating, reading, updating, and deleting issues.
*   **Business Logic:** Validating issue statuses (Open, InProgress, Resolved, Closed) and priorities (Low, Medium, High, Critical).
*   **API Testing:** Verification of RESTful endpoints using Postman and Playwright API requests.
*   **Database Validation:** Ensuring data integrity in the database using SQL queries.
*   **UI/E2E Automation:** Automated flows using Playwright and TypeScript.

### 2.2. Out of Scope
The following areas are excluded from this testing phase:
*   Performance and Load Testing.
*   Advanced Security and Penetration Testing.
*   Mobile Application Testing.
*   Third-party integration testing (if not mocked).

## 3. Test Environment
*   **Backend:** ASP.NET Core Web API
*   **Frontend:** Web UI (HTML/CSS/JS)
*   **Database:** PostgreSQL / SQL Server
*   **Tools:** Playwright, xUnit, Postman, GitHub Actions (CI/CD)

## 4. Testing Types & Approach
*   **Functional Testing:** Manual verification of business requirements based on predefined test cases.
*   **Integration Testing:** Automated xUnit tests for backend integration via `WebApplicationFactory`.
*   **API Testing:** Manual and automated verification of HTTP status codes, response structures, and headers.
*   **End-to-End (E2E) Testing:** Automated UI flows using Playwright with the Page Object Model (POM) design pattern.
*   **Exploratory Testing:** Session-based testing to uncover edge cases not covered by standard test cases.

## 5. Defect Management
Bugs will be documented in the `BUG_REPORTS.md` file. Each defect will include:
*   Clear Title and Description.
*   Steps to Reproduce.
*   Expected vs. Actual Result.
*   Severity (Blocker, Critical, Major, Minor, Trivial) and Priority (High, Medium, Low).