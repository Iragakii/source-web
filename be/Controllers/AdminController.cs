using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebComingAPI.Models;
using WebComingAPI.Services;
using WebComingAPI.DTOs;

namespace WebComingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(IUserService userService, ILogger<AdminController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpGet("users")]
        public async Task<ActionResult<ApiResponse<List<User>>>> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                return Ok(new ApiResponse<List<User>>
                {
                    Success = true,
                    Data = users,
                    Message = "Users retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving users");
                return StatusCode(500, new ApiResponse<List<User>>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpGet("users/{id}")]
        public async Task<ActionResult<ApiResponse<User>>> GetUserById(string id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new ApiResponse<User>
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                return Ok(new ApiResponse<User>
                {
                    Success = true,
                    Data = user,
                    Message = "User retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user with id {UserId}", id);
                return StatusCode(500, new ApiResponse<User>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpPut("users/{id}/role")]
        public async Task<ActionResult<ApiResponse<User>>> UpdateUserRole(string id, [FromBody] UpdateUserRoleRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new ApiResponse<User>
                    {
                        Success = false,
                        Message = "Invalid role data"
                    });
                }

                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new ApiResponse<User>
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                // Prevent removing the last admin
                if (user.Role == "admin" && request.Role != "admin")
                {
                    var adminCount = await _userService.GetActiveAdminCountAsync();
                    if (adminCount <= 1)
                    {
                        return BadRequest(new ApiResponse<User>
                        {
                            Success = false,
                            Message = "Cannot change role of the last active admin user"
                        });
                    }
                }

                user.Role = request.Role;
                user.UpdatedAt = DateTime.UtcNow;

                var updatedUser = await _userService.UpdateUserAsync(user);
                return Ok(new ApiResponse<User>
                {
                    Success = true,
                    Data = updatedUser,
                    Message = "User role updated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user role for user {UserId}", id);
                return StatusCode(500, new ApiResponse<User>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpPatch("users/{id}/toggle-active")]
        public async Task<ActionResult<ApiResponse<User>>> ToggleUserActive(string id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new ApiResponse<User>
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                // Prevent deactivating the last admin
                if (user.Role == "admin" && user.IsActive)
                {
                    var adminCount = await _userService.GetActiveAdminCountAsync();
                    if (adminCount <= 1)
                    {
                        return BadRequest(new ApiResponse<User>
                        {
                            Success = false,
                            Message = "Cannot deactivate the last active admin user"
                        });
                    }
                }

                user.IsActive = !user.IsActive;
                user.UpdatedAt = DateTime.UtcNow;

                var updatedUser = await _userService.UpdateUserAsync(user);
                return Ok(new ApiResponse<User>
                {
                    Success = true,
                    Data = updatedUser,
                    Message = $"User {(updatedUser.IsActive ? "activated" : "deactivated")} successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling user active status for user {UserId}", id);
                return StatusCode(500, new ApiResponse<User>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpDelete("users/{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteUser(string id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                // Prevent deleting the last admin
                if (user.Role == "admin")
                {
                    var adminCount = await _userService.GetActiveAdminCountAsync();
                    if (adminCount <= 1)
                    {
                        return BadRequest(new ApiResponse<object>
                        {
                            Success = false,
                            Message = "Cannot delete the last active admin user"
                        });
                    }
                }

                await _userService.DeleteUserAsync(id);
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "User deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user {UserId}", id);
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpGet("stats")]
        public async Task<ActionResult<ApiResponse<object>>> GetAdminStats()
        {
            try
            {
                var totalUsers = await _userService.GetTotalUserCountAsync();
                var activeUsers = await _userService.GetActiveUserCountAsync();
                var adminUsers = await _userService.GetAdminCountAsync();
                var activeAdmins = await _userService.GetActiveAdminCountAsync();

                var stats = new
                {
                    TotalUsers = totalUsers,
                    ActiveUsers = activeUsers,
                    InactiveUsers = totalUsers - activeUsers,
                    AdminUsers = adminUsers,
                    ActiveAdmins = activeAdmins,
                    RegularUsers = totalUsers - adminUsers
                };

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Data = stats,
                    Message = "Admin statistics retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving admin statistics");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }
    }
}
