using WebComingAPI.Models;
using WebComingAPI.Models.DTOs;

namespace WebComingAPI.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<bool> LogoutAsync(string token);
        Task<User?> GetUserByUsernameAsync(string username);
        Task<User?> GetUserByEmailAsync(string email);
        Task<bool> ValidateTokenAsync(string token);
        string GenerateJwtToken(User user);
    }
}
