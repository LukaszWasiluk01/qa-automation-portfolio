namespace IssueTracker.API.Models
{
    public enum IssueStatus
    {
        Open, InProgress, Resolved, Closed
    }
    public enum IssuePriority
    {
        Low, Medium, High, Critical
    }
    public enum UserRole
    {
        Admin, Tester, Developer
    }
}