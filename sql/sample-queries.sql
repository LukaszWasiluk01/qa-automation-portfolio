-- =================================================================
-- Issue Tracker - Sample SQL Queries for QA Validation (SQL Server)
-- =================================================================
-- Schema matches the EF Core model. Enums are stored as integers:
--   Users.Role      -> 0 Admin, 1 Tester, 2 Developer
--   Issues.Status   -> 0 Open, 1 InProgress, 2 Resolved, 3 Closed
--   Issues.Priority -> 0 Low, 1 Medium, 2 High, 3 Critical
-- These queries are the kind a QA engineer runs to verify the database
-- state after executing manual or automated tests.
-- =================================================================

-- 1. SELECT & WHERE: verify a specific issue was created correctly
SELECT Id, Title, Status, Priority
FROM Issues
WHERE Id = 1;

-- 2. COUNT & GROUP BY: how many issues are in each status (dashboard validation)
SELECT Status, COUNT(*) AS IssueCount
FROM Issues
GROUP BY Status;

-- 3. INNER JOIN: issues together with the assigned user's email
SELECT i.Id, i.Title, i.Status, u.Email AS AssigneeEmail
FROM Issues i
INNER JOIN Users u ON i.AssigneeId = u.Id;

-- 4. LEFT JOIN / IS NULL: find all unassigned issues
SELECT i.Id, i.Title
FROM Issues i
LEFT JOIN Users u ON i.AssigneeId = u.Id
WHERE i.AssigneeId IS NULL;

-- 5. ORDER BY + TOP: top 5 highest-priority open issues (Priority 2 High, 3 Critical)
SELECT TOP 5 Id, Title, Priority
FROM Issues
WHERE Status = 0 AND Priority IN (2, 3)
ORDER BY Priority DESC, CreatedAt DESC;

-- 6. UPDATE: simulate test data manipulation (assign + move to InProgress)
UPDATE Issues
SET AssigneeId = 3, Status = 1
WHERE Id = 1;

-- 7. DELETE: data teardown after automated test execution (remove Closed issues)
DELETE FROM Issues
WHERE Status = 3;

-- 8. GROUP BY + HAVING: developers (Role = 2) with more than one assigned issue
SELECT u.Email, COUNT(i.Id) AS AssignedIssues
FROM Users u
INNER JOIN Issues i ON u.Id = i.AssigneeId
WHERE u.Role = 2
GROUP BY u.Email
HAVING COUNT(i.Id) > 1;

-- 9. Subquery: users who have no issues assigned to them
SELECT Email, Role
FROM Users
WHERE Id NOT IN (SELECT DISTINCT AssigneeId FROM Issues WHERE AssigneeId IS NOT NULL);

-- 10. Aggregate: total number of issues and how many are still open
SELECT
    COUNT(*) AS TotalIssues,
    SUM(CASE WHEN Status = 0 THEN 1 ELSE 0 END) AS OpenIssues
FROM Issues;
