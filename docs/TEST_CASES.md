# Test Cases

This document contains a suite of test cases designed for the **Issue Tracker** application. The test cases cover Authentication, Issue Management (CRUD), and Role-Based Access Control (RBAC).

## 1. Authentication (Auth)

| ID | Title | Preconditions | Steps | Expected Result | Type |
|---|---|---|---|---|---|
| **TC-AUTH-01** | Successful login with valid credentials | User account exists | 1. Navigate to login page<br>2. Enter valid email and password<br>3. Click 'Login' | User is redirected to dashboard; Auth token is generated. | Positive |
| **TC-AUTH-02** | Login fails with invalid password | User account exists | 1. Navigate to login page<br>2. Enter valid email and invalid password<br>3. Click 'Login' | Error message "Invalid credentials" is displayed; User remains on login page. | Negative |
| **TC-AUTH-03** | Login fails with unregistered email | None | 1. Navigate to login page<br>2. Enter unregistered email and password<br>3. Click 'Login' | Error message "User not found" is displayed. | Negative |
| **TC-AUTH-04** | Successful logout | User is logged in | 1. Click 'Profile' menu<br>2. Click 'Logout' | User is redirected to login page; Auth token is cleared from local storage. | Positive |
| **TC-AUTH-05** | Accessing protected route without token | User is not logged in | 1. Manually enter dashboard URL in browser | User is redirected to login page; 401 Unauthorized (if via API). | Security |

## 2. Issue Management (CRUD)

| ID | Title | Preconditions | Steps | Expected Result | Type |
|---|---|---|---|---|---|
| **TC-ISSUE-01** | Create a new issue successfully | User is logged in | 1. Click 'New Issue'<br>2. Fill Title, Description, Priority<br>3. Click 'Save' | Issue is created and displayed in the list with 'Open' status. | Positive |
| **TC-ISSUE-02** | Create issue fails with empty title | User is logged in | 1. Click 'New Issue'<br>2. Leave Title empty<br>3. Fill Description<br>4. Click 'Save' | Validation error "Title is required" is displayed; Issue is not saved. | Negative |
| **TC-ISSUE-03** | Create issue fails with exceedingly long title | User is logged in | 1. Click 'New Issue'<br>2. Enter Title > 255 characters<br>3. Click 'Save' | Validation error "Title exceeds maximum length" is displayed. | Boundary |
| **TC-ISSUE-04** | View list of all issues | User is logged in; Issues exist | 1. Navigate to Dashboard | List of issues is displayed showing Title, Status, and Priority. | Positive |
| **TC-ISSUE-05** | View details of a specific issue | User is logged in; Issue exists | 1. Click on an existing issue from the list | Issue details page opens with full description and history. | Positive |
| **TC-ISSUE-06** | Update an existing issue | User is logged in; Issue exists | 1. Open issue details<br>2. Click 'Edit'<br>3. Change Title<br>4. Click 'Save' | Issue is updated; New title is visible in the issue details. | Positive |
| **TC-ISSUE-07** | Change issue status to 'InProgress' | User is logged in; Issue is 'Open' | 1. Open issue details<br>2. Change status dropdown to 'InProgress'<br>3. Save | Status is updated to 'InProgress'. | Positive |
| **TC-ISSUE-08** | Change issue status to 'Resolved' | User is logged in; Issue is 'InProgress' | 1. Open issue details<br>2. Change status dropdown to 'Resolved'<br>3. Save | Status is updated to 'Resolved'. | Positive |
| **TC-ISSUE-09** | Delete an issue successfully | User logged in as Admin | 1. Open issue details<br>2. Click 'Delete'<br>3. Confirm deletion | Issue is removed from the system and no longer visible in the list. | Positive |
| **TC-ISSUE-10** | Attempt to delete a non-existent issue | User logged in as Admin | 1. Send DELETE request via API with invalid ID | 404 Not Found error is returned. | Negative |

## 3. Role-Based Access Control (RBAC)

| ID | Title | Preconditions | Steps | Expected Result | Type |
|---|---|---|---|---|---|
| **TC-RBAC-01** | Developer can change issue status | Logged in as Developer | 1. Open assigned issue<br>2. Change status to 'InProgress' | Status update is successful. | Positive |
| **TC-RBAC-02** | Developer cannot delete an issue | Logged in as Developer | 1. Open an issue | 'Delete' button is hidden/disabled; API returns 403 Forbidden on DELETE. | Security |
| **TC-RBAC-03** | Tester can create a new issue | Logged in as Tester | 1. Click 'New Issue'<br>2. Fill details and save | Issue is created successfully. | Positive |
| **TC-RBAC-04** | Tester can change issue to 'Closed' | Logged in as Tester; Issue is 'Resolved' | 1. Open resolved issue<br>2. Change status to 'Closed' | Status update is successful. | Positive |
| **TC-RBAC-05** | Admin can assign roles to users | Logged in as Admin | 1. Navigate to User Management<br>2. Change user role to Developer | User role is successfully updated. | Positive |