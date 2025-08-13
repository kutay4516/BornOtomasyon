using System.Threading.Tasks;

namespace BornOtomasyon.API.Services
{
    public interface IEmailService
    {
        Task SendVerificationCodeAsync(string email, string code);
        Task SendPasswordResetCodeAsync(string email, string code);
    }
}