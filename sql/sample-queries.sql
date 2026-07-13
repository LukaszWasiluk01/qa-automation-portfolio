-- =================================================================
-- Issue Tracker - Sample SQL Queries for QA Validation
-- =================================================================

-- 1. SELECT & WHERE: Verify if a specific issue was created correctly
SELECT Title, Status, Priority
FROM Issues
WHERE IssueId = 101;

-- 2. COUNT & GROUP BY: Count how many issues are in each status (useful for dashboard validation)
SELECT Status, COUNT(*) as IssueCount
FROM Issues
GROUP BY Status;

-- 3. INNER JOIN: Retrieve all issues along with the assigned user's email
SELECT i.IssueId, i.Title, i.Status, u.Email as AssigneeEmail
FROM Issues i
INNER JOIN Users u ON i.AssigneeId = u.UserId;

-- 4. LEFT JOIN / IS NULL: Find all "Unassigned" issues (issues without an Assignee)
SELECT i.IssueId, i.Title
FROM Issues i
LEFT JOIN Users u ON i.AssigneeId = u.UserId
WHERE i.AssigneeId IS NULL;

-- 5. ORDER BY: Get top 5 most critical open issues
SELECT IssueId, Title, Priority
FROM Issues
WHERE Status = 'Open' AND Priority IN ('High', 'Critical')
ORDER BY CreatedAt DESC
LIMIT 5; -- Note: Use TOP 5 in SQL Server

-- 6. UPDATE: Simulate test data manipulation (Assigning an issue)
UPDATE Issues
SET AssigneeId = 3, Status = 'InProgress'
WHERE IssueId = 101;

-- 7. DELETE: Data teardown after automated test execution
DELETE FROM Issues
WHERE Status = 'Closed';

-- 8. Complex Query: Find Developers who have more than 1 issue assigned
SELECT u.Username, COUNT(i.IssueId) as AssignedIssues
FROM Users u
JOIN Issues i ON u.UserId = i.AssigneeId
WHERE u.Role = 'Developer'
GROUP BY u.Username
HAVING COUNT(i.IssueId) > 1;