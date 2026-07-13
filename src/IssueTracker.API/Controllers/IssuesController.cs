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
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _context.Issues.ToListAsync());
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
            _context.Issues.Add(issue);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new
            {
                id = issue.Id
            }, issue);
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
}