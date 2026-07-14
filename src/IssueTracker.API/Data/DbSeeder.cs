using IssueTracker.API.Models;

namespace IssueTracker.API.Data
{
    public static class DbSeeder
    {
        public const string DefaultPassword = "TestPassword123!";

        public static void Seed(AppDbContext context)
        {
            if (!context.Users.Any())
            {
                context.Users.AddRange(
                    new User
                    {
                        Email = "admin@issuetracker.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword(DefaultPassword),
                        Role = UserRole.Admin
                    },
                    new User
                    {
                        Email = "tester@issuetracker.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword(DefaultPassword),
                        Role = UserRole.Tester
                    },
                    new User
                    {
                        Email = "developer@issuetracker.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword(DefaultPassword),
                        Role = UserRole.Developer
                    });

                context.SaveChanges();
            }

            if (!context.Issues.Any())
            {
                context.Issues.AddRange(
                    new Issue
                    {
                        Title = "Login button overlaps on mobile",
                        Description = "UI issue on screens smaller than 400px",
                        Status = IssueStatus.Open,
                        Priority = IssuePriority.Medium
                    },
                    new Issue
                    {
                        Title = "API returns 500 on delete with comments",
                        Description = "Deleting an issue that has comments fails",
                        Status = IssueStatus.InProgress,
                        Priority = IssuePriority.Critical
                    },
                    new Issue
                    {
                        Title = "Update dependencies to latest versions",
                        Description = "Routine security patch",
                        Status = IssueStatus.Resolved,
                        Priority = IssuePriority.High
                    });

                context.SaveChanges();
            }
        }
    }
}
