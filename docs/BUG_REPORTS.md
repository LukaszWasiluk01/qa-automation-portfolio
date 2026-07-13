# Bug Reports

This document tracks identified defects in the **Issue Tracker** application.

---

## BUG-01: 500 Internal Server Error when deleting an issue with comments
*   **Status:** Open
*   **Severity:** Critical
*   **Priority:** High
*   **Environment:** QA (Backend v1.0.2)
*   **Steps to Reproduce:**
    1. Log in as Admin.
    2. Navigate to an existing issue that has at least one comment.
    3. Click the 'Delete' button.
    4. Confirm the deletion in the modal window.
*   **Expected Result:** The issue and its associated comments are deleted, and a success message is displayed.
*   **Actual Result:** The application throws a 500 Internal Server Error, and the issue remains in the database.
*   **Notes:** Likely a missing cascading delete rule in the database schema.

---

## BUG-02: Developer role can access the User Management panel
*   **Status:** Open
*   **Severity:** Blocker
*   **Priority:** High (Security)
*   **Environment:** QA (Frontend v1.0.2)
*   **Steps to Reproduce:**
    1. Log in with a 'Developer' role account.
    2. Manually change the URL to `/admin/users`.
*   **Expected Result:** User is redirected to the dashboard with a 403 Forbidden error message.
*   **Actual Result:** User successfully accesses the User Management panel and can view all user emails.
*   **Notes:** Endpoint lacks proper role-based route guards.

---

## BUG-03: 'Save' button does not disable after initial click
*   **Status:** Open
*   **Severity:** Major
*   **Priority:** Medium
*   **Environment:** QA (Frontend v1.0.2)
*   **Steps to Reproduce:**
    1. Log in as a Tester.
    2. Click 'New Issue'.
    3. Fill in required fields.
    4. Rapidly double-click the 'Save' button.
*   **Expected Result:** The button disables immediately after the first click to prevent duplicate submissions.
*   **Actual Result:** The application sends two POST requests, creating duplicate issues in the database.

---

## BUG-04: Issue title exceeding 100 characters breaks UI layout
*   **Status:** Open
*   **Severity:** Minor
*   **Priority:** Low
*   **Environment:** QA (Frontend v1.0.2)
*   **Steps to Reproduce:**
    1. Open the dashboard containing the issue list.
    2. Create an issue with a single word title containing 150 characters (e.g., "A" repeated 150 times).
    3. View the issue list.
*   **Expected Result:** The title is truncated with an ellipsis (...), maintaining the table layout.
*   **Actual Result:** The text overflows its container, pushing other columns off the screen.

---

## BUG-05: Typo on the login screen
*   **Status:** Open
*   **Severity:** Trivial
*   **Priority:** Low
*   **Environment:** QA (Frontend v1.0.2)
*   **Steps to Reproduce:**
    1. Navigate to the login page.
    2. Look at the text below the password input.
*   **Expected Result:** Text should read "Forgot your password?".
*   **Actual Result:** Text reads "Forgt your password?".