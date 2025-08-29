using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebComingAPI.Models.DTOs;
using WebComingAPI.Services;

namespace WebComingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestResultController : ControllerBase
    {
        private readonly ITestResultService _testResultService;
        private readonly ILogger<TestResultController> _logger;

        public TestResultController(ITestResultService testResultService, ILogger<TestResultController> logger)
        {
            _testResultService = testResultService;
            _logger = logger;
        }

        /// <summary>
        /// Submit test result with email and name
        /// </summary>
        [HttpPost("submit")]
        public async Task<ActionResult<ApiResponse<TestResultResponse>>> SubmitTestResult([FromBody] TestResultSubmissionRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    return BadRequest(new ApiResponse<TestResultResponse>
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = errors
                    });
                }

                var result = await _testResultService.SubmitTestResultAsync(request);
                
                if (result.Success)
                {
                    return Ok(result);
                }
                
                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SubmitTestResult endpoint");
                return StatusCode(500, new ApiResponse<TestResultResponse>
                {
                    Success = false,
                    Message = "An internal server error occurred"
                });
            }
        }

        /// <summary>
        /// Get test results by email
        /// </summary>
        [HttpGet("by-email/{email}")]
        public async Task<ActionResult<ApiResponse<List<TestResultResponse>>>> GetTestResultsByEmail(string email)
        {
            try
            {
                if (string.IsNullOrEmpty(email))
                {
                    return BadRequest(new ApiResponse<List<TestResultResponse>>
                    {
                        Success = false,
                        Message = "Email is required"
                    });
                }

                var result = await _testResultService.GetTestResultsByEmailAsync(email);
                
                if (result.Success)
                {
                    return Ok(result);
                }
                
                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetTestResultsByEmail endpoint for {Email}", email);
                return StatusCode(500, new ApiResponse<List<TestResultResponse>>
                {
                    Success = false,
                    Message = "An internal server error occurred"
                });
            }
        }

        /// <summary>
        /// Get a specific test result by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<TestResultResponse>>> GetTestResult(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest(new ApiResponse<TestResultResponse>
                    {
                        Success = false,
                        Message = "Test result ID is required"
                    });
                }

                var result = await _testResultService.GetTestResultByIdAsync(id);
                
                if (result.Success)
                {
                    return Ok(result);
                }
                
                return NotFound(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetTestResult endpoint for {Id}", id);
                return StatusCode(500, new ApiResponse<TestResultResponse>
                {
                    Success = false,
                    Message = "An internal server error occurred"
                });
            }
        }

        /// <summary>
        /// Get all test results with pagination (admin only)
        /// </summary>
        [HttpGet("all")]
        [Authorize] // In a real app, you'd add role-based authorization here
        public async Task<ActionResult<ApiResponse<GetTestResultsResponse>>> GetAllTestResults(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10)
        {
            try
            {
                if (page < 1) page = 1;
                if (pageSize < 1 || pageSize > 100) pageSize = 10;

                var result = await _testResultService.GetAllTestResultsAsync(page, pageSize);
                
                if (result.Success)
                {
                    return Ok(result);
                }
                
                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAllTestResults endpoint");
                return StatusCode(500, new ApiResponse<GetTestResultsResponse>
                {
                    Success = false,
                    Message = "An internal server error occurred"
                });
            }
        }

        /// <summary>
        /// Delete a test result (admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize] // In a real app, you'd add role-based authorization here
        public async Task<ActionResult<ApiResponse<bool>>> DeleteTestResult(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Test result ID is required"
                    });
                }

                var result = await _testResultService.DeleteTestResultAsync(id);
                
                if (result.Success)
                {
                    return Ok(result);
                }
                
                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DeleteTestResult endpoint for {Id}", id);
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = "An internal server error occurred"
                });
            }
        }
    }
}
