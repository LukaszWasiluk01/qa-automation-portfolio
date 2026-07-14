using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using IssueTracker.API.Models;

namespace IssueTracker.Tests
{
    public class AuthIntegrationTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly CustomWebApplicationFactory _factory;

        public AuthIntegrationTests(CustomWebApplicationFactory factory)
        {
            _factory = factory;
        }

        private HttpClient CreateClient() => _factory.CreateClient();

        private static async Task<string> LoginAsync(HttpClient client, string email, string password)
        {
            var response = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest
            {
                Email = email,
                Password = password
            });

            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadFromJsonAsync<JsonElement>();
            return json.GetProperty("token").GetString()!;
        }

        private static void Authorize(HttpClient client, string token) =>
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        [Fact]
        public async Task Register_WithValidData_ReturnsCreated()
        {
            var client = CreateClient();
            var request = new RegisterRequest
            {
                Email = $"new_{Guid.NewGuid():N}@issuetracker.com",
                Password = "TestPassword123!",
                Role = UserRole.Tester
            };

            var response = await client.PostAsJsonAsync("/api/auth/register", request);

            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        }

        [Fact]
        public async Task Register_WithDuplicateEmail_ReturnsBadRequest()
        {
            var client = CreateClient();
            var request = new RegisterRequest
            {
                Email = "admin@issuetracker.com",
                Password = "TestPassword123!",
                Role = UserRole.Admin
            };

            var response = await client.PostAsJsonAsync("/api/auth/register", request);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task Login_WithValidCredentials_ReturnsToken()
        {
            var client = CreateClient();

            var response = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest
            {
                Email = "admin@issuetracker.com",
                Password = "TestPassword123!"
            });

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var json = await response.Content.ReadFromJsonAsync<JsonElement>();
            Assert.False(string.IsNullOrWhiteSpace(json.GetProperty("token").GetString()));
        }

        [Fact]
        public async Task Login_WithInvalidPassword_ReturnsUnauthorized()
        {
            var client = CreateClient();

            var response = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest
            {
                Email = "admin@issuetracker.com",
                Password = "WrongPassword123!"
            });

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task Login_WithUnregisteredEmail_ReturnsUnauthorized()
        {
            var client = CreateClient();

            var response = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest
            {
                Email = "ghost@issuetracker.com",
                Password = "TestPassword123!"
            });

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task Me_WithToken_ReturnsRole()
        {
            var client = CreateClient();
            var token = await LoginAsync(client, "admin@issuetracker.com", "TestPassword123!");
            Authorize(client, token);

            var response = await client.GetAsync("/api/auth/me");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var json = await response.Content.ReadFromJsonAsync<JsonElement>();
            Assert.Equal("Admin", json.GetProperty("role").GetString());
        }

        [Fact]
        public async Task GetIssues_WithoutToken_ReturnsUnauthorized()
        {
            var client = CreateClient();

            var response = await client.GetAsync("/api/issues");

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task GetIssues_WithToken_ReturnsOkArray()
        {
            var client = CreateClient();
            var token = await LoginAsync(client, "tester@issuetracker.com", "TestPassword123!");
            Authorize(client, token);

            var response = await client.GetAsync("/api/issues");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var json = await response.Content.ReadFromJsonAsync<JsonElement>();
            Assert.Equal(JsonValueKind.Array, json.ValueKind);
        }

        [Fact]
        public async Task CreateIssue_WithValidData_ReturnsCreated()
        {
            var client = CreateClient();
            var token = await LoginAsync(client, "tester@issuetracker.com", "TestPassword123!");
            Authorize(client, token);

            var response = await client.PostAsJsonAsync("/api/issues", new
            {
                title = "Integration created issue",
                description = "Created from xUnit",
                priority = 2
            });

            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            var json = await response.Content.ReadFromJsonAsync<JsonElement>();
            Assert.True(json.GetProperty("id").GetInt32() > 0);
        }

        [Fact]
        public async Task CreateIssue_WithoutTitle_ReturnsBadRequest()
        {
            var client = CreateClient();
            var token = await LoginAsync(client, "tester@issuetracker.com", "TestPassword123!");
            Authorize(client, token);

            var response = await client.PostAsJsonAsync("/api/issues", new
            {
                description = "Missing title",
                priority = 1
            });

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task GetIssueById_NonExistent_ReturnsNotFound()
        {
            var client = CreateClient();
            var token = await LoginAsync(client, "tester@issuetracker.com", "TestPassword123!");
            Authorize(client, token);

            var response = await client.GetAsync("/api/issues/999999");

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task UpdateStatus_ChangesStatus_ReturnsOk()
        {
            var client = CreateClient();
            var token = await LoginAsync(client, "tester@issuetracker.com", "TestPassword123!");
            Authorize(client, token);

            var created = await client.PostAsJsonAsync("/api/issues", new { title = "Status target", priority = 1 });
            var createdJson = await created.Content.ReadFromJsonAsync<JsonElement>();
            var id = createdJson.GetProperty("id").GetInt32();

            var response = await client.PatchAsJsonAsync($"/api/issues/{id}/status", new { status = (int)IssueStatus.Resolved });

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var json = await response.Content.ReadFromJsonAsync<JsonElement>();
            Assert.Equal((int)IssueStatus.Resolved, json.GetProperty("status").GetInt32());
        }

        [Fact]
        public async Task UpdateIssue_Put_ReturnsOk()
        {
            var client = CreateClient();
            var token = await LoginAsync(client, "tester@issuetracker.com", "TestPassword123!");
            Authorize(client, token);

            var created = await client.PostAsJsonAsync("/api/issues", new { title = "Before update", priority = 1 });
            var createdJson = await created.Content.ReadFromJsonAsync<JsonElement>();
            var id = createdJson.GetProperty("id").GetInt32();

            var response = await client.PutAsJsonAsync($"/api/issues/{id}", new
            {
                title = "After update",
                description = "Updated body",
                status = (int)IssueStatus.InProgress,
                priority = (int)IssuePriority.High
            });

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var json = await response.Content.ReadFromJsonAsync<JsonElement>();
            Assert.Equal("After update", json.GetProperty("title").GetString());
        }

        [Fact]
        public async Task DeleteIssue_AsAdmin_ReturnsNoContent()
        {
            var client = CreateClient();
            var token = await LoginAsync(client, "admin@issuetracker.com", "TestPassword123!");
            Authorize(client, token);

            var created = await client.PostAsJsonAsync("/api/issues", new { title = "To be deleted", priority = 1 });
            var createdJson = await created.Content.ReadFromJsonAsync<JsonElement>();
            var id = createdJson.GetProperty("id").GetInt32();

            var response = await client.DeleteAsync($"/api/issues/{id}");

            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        }

        [Fact]
        public async Task DeleteIssue_AsNonAdmin_ReturnsForbidden()
        {
            var client = CreateClient();

            var adminToken = await LoginAsync(client, "admin@issuetracker.com", "TestPassword123!");
            Authorize(client, adminToken);
            var created = await client.PostAsJsonAsync("/api/issues", new { title = "Protected issue", priority = 1 });
            var createdJson = await created.Content.ReadFromJsonAsync<JsonElement>();
            var id = createdJson.GetProperty("id").GetInt32();

            var testerToken = await LoginAsync(client, "tester@issuetracker.com", "TestPassword123!");
            Authorize(client, testerToken);

            var response = await client.DeleteAsync($"/api/issues/{id}");

            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }
    }
}
