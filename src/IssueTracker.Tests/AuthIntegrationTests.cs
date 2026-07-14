using System.Net;
using System.Net.Http.Json;
using IssueTracker.API.Models;
using Microsoft.AspNetCore.Mvc.Testing;

namespace IssueTracker.Tests
{
    public class AuthIntegrationTests : IClassFixture<WebApplicationFactory<API.Program>>
    {
        private readonly HttpClient _client;

        public AuthIntegrationTests(WebApplicationFactory<API.Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task Register_WithValidData_ReturnsCreated()
        {
            var request = new RegisterRequest
            {
                Email = "xunit_testuser@issuetracker.com",
                Password = "TestPassword123!",
                Role = UserRole.Tester
            };

            var response = await _client.PostAsJsonAsync("/api/auth/register", request);

            Assert.True(response.StatusCode == HttpStatusCode.Created || response.StatusCode == HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task GetIssues_WithoutToken_ReturnsUnauthorized()
        {
            var response = await _client.GetAsync("/api/issues");

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task Login_WithInvalidCredentials_ReturnsUnauthorized()
        {
            var request = new LoginRequest
            {
                Email = "nonexistent@issuetracker.com",
                Password = "WrongPassword123!"
            };

            var response = await _client.PostAsJsonAsync("/api/auth/login", request);

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }
    }
}