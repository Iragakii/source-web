using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using WebComingAPI.Data;
using WebComingAPI.Models;
using WebComingAPI.Models.DTOs;
using BCrypt.Net;

namespace WebComingAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly MongoDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;
        private readonly HashSet<string> _blacklistedTokens = new();

        public AuthService(MongoDbContext context, IConfiguration configuration, ILogger<AuthService> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            try
            {
                // Check if username already exists
                var existingUserByUsername = await GetUserByUsernameAsync(request.Username);
                if (existingUserByUsername != null)
                {
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Username already exists"
                    };
                }

                // Check if email already exists
                var existingUserByEmail = await GetUserByEmailAsync(request.Email);
                if (existingUserByEmail != null)
                {
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Email already exists"
                    };
                }

                // Create new user
                var user = new User
                {
                    Username = request.Username,
                    Email = request.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    Role = request.Username.ToLower() == "admin" ? "admin" : "user", // Make 'admin' username an admin by default
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                await _context.Users.InsertOneAsync(user);

                // Generate JWT token
                var token = GenerateJwtToken(user);

                return new AuthResponse
                {
                    Success = true,
                    Message = "Account created successfully",
                    Token = token,
                    User = new UserInfo
                    {
                        Id = user.Id!,
                        Username = user.Username,
                        Email = user.Email,
                        Role = user.Role,
                        CreatedAt = user.CreatedAt
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user registration");
                return new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred during registration"
                };
            }
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            try
            {
                var user = await GetUserByUsernameAsync(request.Username);
                if (user == null || !user.IsActive)
                {
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid username or password"
                    };
                }

                // Verify password
                if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                {
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid username or password"
                    };
                }

                // Update last login time
                user.UpdatedAt = DateTime.UtcNow;
                await _context.Users.ReplaceOneAsync(u => u.Id == user.Id, user);

                // Generate JWT token
                var token = GenerateJwtToken(user);

                return new AuthResponse
                {
                    Success = true,
                    Message = "Login successful",
                    Token = token,
                    User = new UserInfo
                    {
                        Id = user.Id!,
                        Username = user.Username,
                        Email = user.Email,
                        Role = user.Role,
                        CreatedAt = user.CreatedAt
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user login");
                return new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred during login"
                };
            }
        }

        public async Task<bool> LogoutAsync(string token)
        {
            try
            {
                // Add token to blacklist
                _blacklistedTokens.Add(token);
                return await Task.FromResult(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout");
                return false;
            }
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            try
            {
                return await _context.Users
                    .Find(u => u.Username == username && u.IsActive)
                    .FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user by username");
                return null;
            }
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            try
            {
                return await _context.Users
                    .Find(u => u.Email == email && u.IsActive)
                    .FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user by email");
                return null;
            }
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            try
            {
                if (_blacklistedTokens.Contains(token))
                    return false;

                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_configuration["JWT:SecretKey"]!);

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["JWT:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _configuration["JWT:Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return await Task.FromResult(true);
            }
            catch
            {
                return false;
            }
        }

        public string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JWT:SecretKey"]!);
            var expiryHours = int.Parse(_configuration["JWT:ExpiryInHours"]!);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id!),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role) // Add role claim to JWT token
                }),
                Expires = DateTime.UtcNow.AddHours(expiryHours),
                Issuer = _configuration["JWT:Issuer"],
                Audience = _configuration["JWT:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
