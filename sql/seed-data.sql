-- =================================================================
-- Issue Tracker - Test Data Seeding Script
-- Database: PostgreSQL / SQL Server
-- =================================================================

-- 1. Create Tables
CREATE TABLE Users (
    UserId INT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Role VARCHAR(20) NOT NULL -- Admin, Developer, Tester
);

CREATE TABLE Issues (
    IssueId INT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    Status VARCHAR(20) NOT NULL, -- Open, InProgress, Resolved, Closed
    Priority VARCHAR(20) NOT NULL, -- Low, Medium, High, Critical
    AssigneeId INT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (AssigneeId) REFERENCES Users(UserId)
);

-- 2. Insert Test Users
INSERT INTO Users (UserId, Username, Email, Role) VALUES
(1, 'admin_user', 'admin@issuetracker.com', 'Admin'),
(2, 'dev_john', 'john.dev@issuetracker.com', 'Developer'),
(3, 'dev_anna', 'anna.dev@issuetracker.com', 'Developer'),
(4, 'qa_tester', 'tester@issuetracker.com', 'Tester');

-- 3. Insert Test Issues
INSERT INTO Issues (IssueId, Title, Description, Status, Priority, AssigneeId) VALUES
(101, 'Login button is overlapping on mobile', 'UI issue on screens < 400px', 'Open', 'Medium', NULL),
(102, 'API returns 500 on delete', 'Deleting an issue with comments fails', 'InProgress', 'Critical', 2),
(103, 'Update dependencies to latest versions', 'Security patch', 'Resolved', 'High', 3),
(104, 'Typo in registration email', 'Change "wellcome" to "welcome"', 'Closed', 'Low', 2),
(105, 'Add dark mode toggle', 'Feature request from marketing', 'Open', 'Low', NULL);