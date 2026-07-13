# Exploratory Testing Notes

This document contains findings from session-based exploratory testing.

## Session 1: Authentication and Session Management

*   **Charter:** Explore the login, logout, and session timeout mechanisms to find edge cases not covered by standard test cases.
*   **Timebox:** 45 minutes
*   **Tester:** QA Engineer

### Observations & Findings
*   **Session Persistence:** After logging in and closing the browser tab, reopening the tab correctly restores the session without asking for credentials again. This works as expected.
*   **Multiple Tabs:** Logging out from Tab A does not automatically redirect or lock out Tab B until an action is performed in Tab B. *(Note: Could be improved for better security, but not a bug per se).*
*   **Token Expiration:** The JWT token is set to expire in 1 hour. Modifying the system clock manually on the client side does not bypass this, which confirms the server correctly validates the token signature and expiration.
*   **Bug Found:** Logging in, clicking 'back' in the browser, and clicking 'forward' causes a weird UI state where the navigation bar disappears. I will log this as a minor UI bug.