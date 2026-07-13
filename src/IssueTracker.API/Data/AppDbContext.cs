using IssueTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace IssueTracker.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users
        {
            get; set;
        }
        public DbSet<Issue> Issues
        {
            get; set;
        }
    }
}