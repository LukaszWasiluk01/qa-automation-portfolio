using IssueTracker.API.Data;
using IssueTracker.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace IssueTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IssuesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public IssuesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] IssueStatus? status, [FromQuery] string? sort)
        {
            IQueryable<Issue> query = _context.Issues;

            if (status.HasValue)
                query = query.Where(i => i.Status == status.Value);

            query = sort?.ToLowerInvariant() switch
            {
                "priority" => query.OrderByDescending(i => i.Priority),
                "created" => query.OrderByDescending(i => i.CreatedAt),
                _ => query.OrderBy(i => i.Id)
            };

            return Ok(await query.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var issue = await _context.Issues.FindAsync(id);
            if (issue == null)
                return NotFound();

            return Ok(issue);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Issue issue)
        {
            issue.Id = 0;
            issue.CreatedAt = DateTime.UtcNow;

            _context.Issues.Add(issue);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new
            {
                id = issue.Id
            }, issue);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateIssueDto request)
        {
            var issue = await _context.Issues.FindAsync(id);
            if (issue == null)
                return NotFound();

            issue.Title = request.Title;
            issue.Description = request.Description;
            issue.Status = request.Status;
            issue.Priority = request.Priority;
            issue.AssigneeId = request.AssigneeId;

            await _context.SaveChangesAsync();

            return Ok(issue);
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto request)
        {
            var issue = await _context.Issues.FindAsync(id);
            if (issue == null)
                return NotFound();

            issue.Status = request.Status;
            await _context.SaveChangesAsync();

            return Ok(issue);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (userRole != UserRole.Admin.ToString())
                return Forbid();

            var issue = await _context.Issues.FindAsync(id);
            if (issue == null)
                return NotFound();

            _context.Issues.Remove(issue);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class UpdateStatusDto
    {
        public IssueStatus Status
        {
            get; set;
        }
    }

    public class UpdateIssueDto
    {
        [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Title is required")]
        [System.ComponentModel.DataAnnotations.MaxLength(255, ErrorMessage = "Title exceeds maximum length")]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public IssueStatus Status
        {
            get; set;
        }

        public IssuePriority Priority
        {
            get; set;
        }

        public int? AssigneeId
        {
            get; set;
        }
    }
}
