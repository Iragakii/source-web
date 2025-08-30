using WebComingAPI.Models;

namespace WebComingAPI.Services
{
    public interface IUserService
    {
        Task<User?> GetUserByIdAsync(string id);
        Task<User?> GetUserByUsernameAsync(string username);
        Task<User?> GetUserByEmailAsync(string email);
        Task<List<User>> GetAllUsersAsync();
        Task<User> CreateUserAsync(User user);
        Task<User> UpdateUserAsync(User user);
        Task DeleteUserAsync(string id);
        Task<bool> ValidatePasswordAsync(User user, string password);
        Task<int> GetTotalUserCountAsync();
        Task<int> GetActiveUserCountAsync();
        Task<int> GetAdminCountAsync();
        Task<int> GetActiveAdminCountAsync();
    }
}
