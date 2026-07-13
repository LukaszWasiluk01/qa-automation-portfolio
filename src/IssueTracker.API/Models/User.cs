using System.ComponentModel.DataAnnotations;

namespace IssueTracker.API.Models
{
    public class User
    {
        public int Id
        {
            get; set;
        }

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public UserRole Role { get; set; } = UserRole.Tester;
    }
}