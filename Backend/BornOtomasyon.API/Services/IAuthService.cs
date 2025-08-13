using BornOtomasyon.API.Models;
using BornOtomasyon.API.Models.DTOs;
using System.Threading.Tasks;

namespace BornOtomasyon.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
        Task<bool> ForgotPasswordAsync(string email);
        Task<bool> ResetPasswordAsync(string email, string token, string newPassword);
        string GenerateJwtToken(ApplicationUser user);
        Task<bool> VerifyEmailCodeAsync(string email, string code);
        Task<bool> ResendVerificationCodeAsync(string email);
    }
}