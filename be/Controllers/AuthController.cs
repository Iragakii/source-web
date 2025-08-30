using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebComingAPI.Models.DTOs;
using WebComingAPI.Services;

namespace WebComingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<AuthResponse>>> Register([FromBody] RegisterRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    return BadRequest(new ApiResponse<AuthResponse>
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = errors
                    });
                }

                var result = await _authService.RegisterAsync(request);

                if (!result.Success)
                {
                    return BadRequest(new ApiResponse<AuthResponse>
                    {
                        Success = false,
                        Message = result.Message,
                        Data = result
                    });
                }

                return Ok(new ApiResponse<AuthResponse>
                {
                    Success = true,
                    Message = result.Message,
                    Data = result
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in Register endpoint");
                return StatusCode(500, new ApiResponse<AuthResponse>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<AuthResponse>>> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    return BadRequest(new ApiResponse<AuthResponse>
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = errors
                    });
                }

                var result = await _authService.LoginAsync(request);

                if (!result.Success)
                {
                    return BadRequest(new ApiResponse<AuthResponse>
                    {
                        Success = false,
                        Message = result.Message,
                        Data = result
                    });
                }

                return Ok(new ApiResponse<AuthResponse>
                {
                    Success = true,
                    Message = result.Message,
                    Data = result
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in Login endpoint");
                return StatusCode(500, new ApiResponse<AuthResponse>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<object>>> Logout()
        {
            try
            {
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                
                if (string.IsNullOrEmpty(token))
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Token is required"
                    });
                }

                var result = await _authService.LogoutAsync(token);

                if (!result)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Logout failed"
                    });
                }

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Logout successful"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in Logout endpoint");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<UserInfo>>> GetProfile()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var username = User.FindFirst(ClaimTypes.Name)?.Value;
                var email = User.FindFirst(ClaimTypes.Email)?.Value;

                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(username) || string.IsNullOrEmpty(email))
                {
                    return BadRequest(new ApiResponse<UserInfo>
                    {
                        Success = false,
                        Message = "Invalid token claims"
                    });
                }

                var user = await _authService.GetUserByUsernameAsync(username);
                if (user == null)
                {
                    return NotFound(new ApiResponse<UserInfo>
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                var userInfo = new UserInfo
                {
                    Id = user.Id!,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role,
                    CreatedAt = user.CreatedAt
                };

                return Ok(new ApiResponse<UserInfo>
                {
                    Success = true,
                    Message = "Profile retrieved successfully",
                    Data = userInfo
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetProfile endpoint");
                return StatusCode(500, new ApiResponse<UserInfo>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpGet("validate")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<object>>> ValidateToken()
        {
            try
            {
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                
                if (string.IsNullOrEmpty(token))
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Token is required"
                    });
                }

                var isValid = await _authService.ValidateTokenAsync(token);

                return Ok(new ApiResponse<object>
                {
                    Success = isValid,
                    Message = isValid ? "Token is valid" : "Token is invalid"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in ValidateToken endpoint");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }
    }
}
