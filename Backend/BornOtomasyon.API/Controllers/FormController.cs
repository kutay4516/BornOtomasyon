using BornOtomasyon.API.Data;
using BornOtomasyon.API.Models;
using BornOtomasyon.API.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BornOtomasyon.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FormController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<FormController> _logger;

        public FormController(ApplicationDbContext context, ILogger<FormController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitForm([FromBody] FormDataDto formDataDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Additional validation
            if (string.IsNullOrEmpty(formDataDto.Text1) || formDataDto.Text1.Length > 100)
                return BadRequest("Text1 must be between 1 and 100 characters");

            if (formDataDto.Num1 < 50 || formDataDto.Num1 > 100)
                return BadRequest("Num1 must be between 50 and 100");

            if (formDataDto.Date1 <= DateTime.Today)
                return BadRequest("Date1 must be a future date");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not found");

            try
            {
                var formData = new FormData
                {
                    Text1 = formDataDto.Text1,
                    Num1 = formDataDto.Num1,
                    Date1 = formDataDto.Date1,
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.FormData.Add(formData);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Form submitted successfully by user: {userId}");

                return Ok(new { message = "Form submitted successfully", id = formData.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error submitting form for user: {userId}");
                return StatusCode(500, "An error occurred while submitting the form");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetUserForms()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not found");

            try
            {
                var forms = await _context.FormData
                    .Where(f => f.UserId == userId)
                    .OrderByDescending(f => f.CreatedAt)
                    .Select(f => new
                    {
                        f.Id,
                        f.Text1,
                        f.Num1,
                        f.Date1,
                        f.CreatedAt
                    })
                    .ToListAsync();

                return Ok(forms);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving forms for user: {userId}");
                return StatusCode(500, "An error occurred while retrieving forms");
            }
        }
    }
}