using System.ComponentModel.DataAnnotations;

namespace IssueTracker.API.Models
{
    public class Issue
    {
        public int Id
        {
            get; set;
        }

        [Required(ErrorMessage = "Title is required")]
        [MaxLength(255, ErrorMessage = "Title exceeds maximum length")]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public IssueStatus Status { get; set; } = IssueStatus.Open;

        public IssuePriority Priority { get; set; } = IssuePriority.Medium;

        public int? AssigneeId
        {
            get; set;
        }
        public User? Assignee
        {
            get; set;
        }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}