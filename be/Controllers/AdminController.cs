using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebComingAPI.Services;
using WebComingAPI.DTOs;

namespace WebComingAPI.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IDataSeedService _dataSeedService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(IUserService userService, IDataSeedService dataSeedService, ILogger<AdminController> logger)
        {
            _userService = userService;
            _dataSeedService = dataSeedService;
            _logger = logger;
        }

        [HttpGet("users")]
        public async Task<ActionResult<ApiResponse<object>>> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                var userList = users.Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.Role,
                    u.CreatedAt
                }).ToList();

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Data = userList,
                    Message = $"Retrieved {userList.Count} users"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving users");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Error retrieving users: {ex.Message}"
                });
            }
        }

        [HttpPost("reseed-database")]
        public async Task<ActionResult<ApiResponse<object>>> ReseedDatabase()
        {
            try
            {
                _logger.LogInformation("Admin requested database reseed");
                await _dataSeedService.ReseedAllDataAsync();
                
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Data = new { Message = "Database reseeded successfully" },
                    Message = "Database has been cleared and reseeded with fresh data"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reseeding database");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Error reseeding database: {ex.Message}"
                });
            }
        }

        [HttpPost("clear-database")]
        public async Task<ActionResult<ApiResponse<object>>> ClearDatabase()
        {
            try
            {
                _logger.LogInformation("Admin requested database clear");
                await _dataSeedService.ClearAllDataAsync();
                
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Data = new { Message = "Database cleared successfully" },
                    Message = "All course and video data has been cleared from database"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing database");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Error clearing database: {ex.Message}"
                });
            }
        }
    }
}
