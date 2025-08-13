using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace BornOtomasyon.API.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendVerificationCodeAsync(string email, string code)
        {
            try
            {
                _logger.LogInformation($"Verification code sent to {email}");

                Console.WriteLine($@"
=== EMAIL VERIFICATION CODE ===
To: {email}
Code: {code}
Expires in: 10 minutes
================================");

                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send verification code to {email}");
                throw;
            }
        }

        public async Task SendEmailConfirmationAsync(string email, string token)
        {
            try
            {
                var baseUrl = _configuration["Application:BaseUrl"] ?? "https://localhost:7000";
                var confirmationLink = $"{baseUrl}/api/auth/confirm-email?email={Uri.EscapeDataString(email)}&token={Uri.EscapeDataString(token)}";

                Console.WriteLine($"=== EMAIL CONFIRMATION ===");
                Console.WriteLine($"To: {email}");
                Console.WriteLine($"Link: {confirmationLink}");
                Console.WriteLine($"Token: {token}");
                Console.WriteLine("===========================");

                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send confirmation email to {email}");
                throw;
            }
        }

        public async Task SendPasswordResetCodeAsync(string email, string code)
        {
            try
            {
                Console.WriteLine($@"
=== PASSWORD RESET CODE ===
To: {email}
Code: {code}
Expires in: 10 minutes
===========================");

                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send password reset code to {email}");
                throw;
            }
        }
    }
}
