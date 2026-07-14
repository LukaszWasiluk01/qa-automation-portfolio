using System.Linq;
using IssueTracker.API.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace IssueTracker.Tests
{
    /// <summary>
    /// Boots the real API in-process with an isolated in-memory database per factory
    /// instance, so integration tests never depend on an external SQL Server or on the
    /// ASPNETCORE_ENVIRONMENT variable being set by the runner.
    /// </summary>
    public class CustomWebApplicationFactory : WebApplicationFactory<API.Program>
    {
        private readonly string _databaseName = $"IssueTrackerTests_{Guid.NewGuid()}";

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Testing");

            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
                if (descriptor != null)
                    services.Remove(descriptor);

                services.AddDbContext<AppDbContext>(options =>
                    options.UseInMemoryDatabase(_databaseName));

                var provider = services.BuildServiceProvider();
                using var scope = provider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                context.Database.EnsureCreated();
                DbSeeder.Seed(context);
            });
        }
    }
}
