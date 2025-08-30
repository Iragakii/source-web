using Microsoft.AspNetCore.Mvc;
using WebComingAPI.Services;
using WebComingAPI.DTOs;

namespace WebComingAPI.Controllers
{
    [ApiController]
    [Route("api/database")]
    public class DatabaseController : ControllerBase
    {
        private readonly IDataSeedService _dataSeedService;
        private readonly ILogger<DatabaseController> _logger;

        public DatabaseController(IDataSeedService dataSeedService, ILogger<DatabaseController> logger)
        {
            _dataSeedService = dataSeedService;
            _logger = logger;
        }

        [HttpPost("reseed")]
        public async Task<ActionResult<ApiResponse<object>>> ReseedDatabase()
        {
            try
            {
                _logger.LogInformation("Database reseed requested");
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

        [HttpPost("clear")]
        public async Task<ActionResult<ApiResponse<object>>> ClearDatabase()
        {
            try
            {
                _logger.LogInformation("Database clear requested");
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
