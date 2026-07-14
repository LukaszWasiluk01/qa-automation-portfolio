# Test Cases - Issue Tracker

This document contains a structured suite of manual test cases covering Authentication, Issue Management (CRUD), Role-Based Access Control (RBAC), and Edge Cases.

## 1. Authentication (AUTH)
| ID | Title | Preconditions | Steps | Expected Result |
|---|---|---|---|---|
| TC-001 | Successful Login | User exists in DB | 1. Enter valid email.<br>2. Enter valid password.<br>3. Click Login. | HTTP 200 / Redirect to Dashboard. Token generated. |
| TC-002 | Login with Invalid Password | User exists in DB | 1. Enter valid email.<br>2. Enter wrong password.<br>3. Click Login. | HTTP 401 Unauthorized. Error message displayed. |
| TC-003 | Login with Unregistered Email | API is running | 1. Enter unregistered email.<br>2. Enter any password.<br>3. Click Login. | HTTP 401 Unauthorized. Error message displayed. |
| TC-004 | Login with Missing Fields | API is running | 1. Leave email empty.<br>2. Click Login. | Validation error (HTTP 400). |
| TC-005 | Token Expiration | User is logged in | 1. Wait for token expiry (e.g., 1 hour).<br>2. Attempt to fetch issues. | HTTP 401 Unauthorized. User logged out. |

## 2. Issue Management (ISSUE)
| ID | Title | Preconditions | Steps | Expected Result |
|---|---|---|---|---|
| TC-006 | Create Issue - Valid Data | Logged in | 1. Enter Title.<br>2. Enter Description.<br>3. Submit. | HTTP 201 Created. Issue appears in the list. |
| TC-007 | Create Issue - Missing Title | Logged in | 1. Leave Title blank.<br>2. Submit. | HTTP 400 Bad Request. Validation error. |
| TC-008 | Create Issue - Empty Description | Logged in | 1. Enter Title.<br>2. Leave Description blank.<br>3. Submit. | HTTP 201 Created (Description is optional). |
| TC-009 | Retrieve Issue List | Logged in, Issues exist | 1. Send GET request to `/api/issues`. | HTTP 200 OK. Returns JSON array of issues. |
| TC-010 | Retrieve Single Issue | Logged in, Issue ID exists | 1. Send GET request to `/api/issues/{id}`. | HTTP 200 OK. Returns specific issue details. |
| TC-011 | Retrieve Non-existent Issue | Logged in | 1. Send GET request with invalid ID. | HTTP 404 Not Found. |
| TC-012 | Update Issue Title | Logged in as creator | 1. Send PUT request with new Title. | HTTP 204 No Content / 200 OK. Title updated. |
| TC-013 | Update Issue Status | Logged in as creator | 1. Change status from Open to InProgress. | Status successfully updated in DB. |
| TC-014 | Invalid Status Transition | Logged in as creator | 1. Change status from Open directly to Closed. | Validation error / HTTP 400 Bad Request. |
| TC-015 | Delete Issue | Logged in as creator | 1. Send DELETE request to `/api/issues/{id}`. | HTTP 204 No Content. Issue removed. |
| TC-016 | Filter Issues by Status | Logged in | 1. Send GET request with `?status=Open`. | Returns only issues with Open status. |
| TC-017 | Sort Issues by Priority | Logged in | 1. Send GET request with `?sort=priority`. | Returns issues ordered by priority (High to Low). |

## 3. Role-Based Access Control (RBAC) & Edge Cases
| ID | Title | Preconditions | Steps | Expected Result |
|---|---|---|---|---|
| TC-018 | Delete Issue - Unauthorized | Logged in as Standard User | 1. Attempt to delete an issue created by another user. | HTTP 403 Forbidden. |
| TC-019 | Delete Issue - Admin Access | Logged in as Admin | 1. Delete an issue created by a Standard User. | HTTP 204 No Content. Successful deletion. |
| TC-020 | Access API without Token | API is running | 1. Send GET `/api/issues` without Auth header. | HTTP 401 Unauthorized. |
| TC-021 | SQL Injection Attempt | API is running | 1. Enter `' OR 1=1;--` in Email field. | HTTP 400/401. Handled safely by EF Core. |
| TC-022 | XSS Payload in Title | Logged in | 1. Enter `<script>alert('xss')</script>` as Title. | Input is sanitized or safely encoded in UI. |
| TC-023 | Out-of-bounds Priority | Logged in | 1. Send POST with `Priority: 999`. | HTTP 400 Bad Request. |
| TC-024 | Malformed JSON Payload | Logged in | 1. Send POST with broken JSON syntax. | HTTP 400 Bad Request. |
| TC-025 | Concurrent Updates | Logged in | 1. Update same issue simultaneously from two clients. | Concurrency conflict handled (HTTP 409). |
| TC-026 | Huge Payload | Logged in | 1. Send Description with 10MB text. | HTTP 413 Payload Too Large / HTTP 400. |