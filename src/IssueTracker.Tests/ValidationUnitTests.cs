using System.ComponentModel.DataAnnotations;
using IssueTracker.API.Models;

namespace IssueTracker.Tests
{
    /// <summary>
    /// Pure unit tests exercising the DataAnnotations validation rules on the models,
    /// independent of the HTTP pipeline.
    /// </summary>
    public class ValidationUnitTests
    {
        private static IList<ValidationResult> Validate(object model)
        {
            var context = new ValidationContext(model);
            var results = new List<ValidationResult>();
            Validator.TryValidateObject(model, context, results, validateAllProperties: true);
            return results;
        }

        [Fact]
        public void Issue_WithoutTitle_IsInvalid()
        {
            var issue = new Issue { Title = string.Empty, Description = "no title" };

            var results = Validate(issue);

            Assert.Contains(results, r => r.MemberNames.Contains(nameof(Issue.Title)));
        }

        [Fact]
        public void Issue_WithValidTitle_IsValid()
        {
            var issue = new Issue { Title = "Valid title", Description = "ok" };

            var results = Validate(issue);

            Assert.Empty(results);
        }

        [Fact]
        public void Issue_WithTitleOverMaxLength_IsInvalid()
        {
            var issue = new Issue { Title = new string('A', 256) };

            var results = Validate(issue);

            Assert.Contains(results, r => r.MemberNames.Contains(nameof(Issue.Title)));
        }

        [Fact]
        public void LoginRequest_WithInvalidEmail_IsInvalid()
        {
            var request = new LoginRequest { Email = "not-an-email", Password = "secret" };

            var results = Validate(request);

            Assert.Contains(results, r => r.MemberNames.Contains(nameof(LoginRequest.Email)));
        }

        [Fact]
        public void RegisterRequest_DefaultsToTesterRole()
        {
            var request = new RegisterRequest { Email = "user@issuetracker.com", Password = "secret" };

            Assert.Equal(UserRole.Tester, request.Role);
        }
    }
}
