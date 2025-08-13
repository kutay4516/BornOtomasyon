using Microsoft.AspNetCore.Identity;
using System;

namespace BornOtomasyon.API.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? EmailVerificationCode { get; set; }
        public DateTime? EmailVerificationCodeExpiry { get; set; }
        public string? PasswordResetCode { get; set; }
        public DateTime? PasswordResetCodeExpiry { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public bool IsEmailConfirmed { get; set; }
        public string? EmailConfirmationToken { get; set; }
    }
}