using MongoDB.Driver;
using WebComingAPI.Data;
using WebComingAPI.Models;
using BCrypt.Net;

namespace WebComingAPI.Services
{
    public class UserService : IUserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(MongoDbContext context)
        {
            _users = context.Users;
        }

        public async Task<User?> GetUserByIdAsync(string id)
        {
            return await _users.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _users.Find(u => u.Username == username).FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _users.Find(_ => true).ToListAsync();
        }

        public async Task<User> CreateUserAsync(User user)
        {
            await _users.InsertOneAsync(user);
            return user;
        }

        public async Task<User> UpdateUserAsync(User user)
        {
            await _users.ReplaceOneAsync(u => u.Id == user.Id, user);
            return user;
        }

        public async Task DeleteUserAsync(string id)
        {
            await _users.DeleteOneAsync(u => u.Id == id);
        }

        public Task<bool> ValidatePasswordAsync(User user, string password)
        {
            return Task.FromResult(BCrypt.Net.BCrypt.Verify(password, user.PasswordHash));
        }

        public async Task<int> GetTotalUserCountAsync()
        {
            return (int)await _users.CountDocumentsAsync(_ => true);
        }

        public async Task<int> GetActiveUserCountAsync()
        {
            return (int)await _users.CountDocumentsAsync(u => u.IsActive);
        }

        public async Task<int> GetAdminCountAsync()
        {
            return (int)await _users.CountDocumentsAsync(u => u.Role == "admin");
        }

        public async Task<int> GetActiveAdminCountAsync()
        {
            return (int)await _users.CountDocumentsAsync(u => u.Role == "admin" && u.IsActive);
        }
    }
}
