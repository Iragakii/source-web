using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using WebComingAPI.Models.DTOs;
using WebComingAPI.Services;

namespace WebComingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly ILogger<CourseController> _logger;

        public CourseController(ICourseService courseService, ILogger<CourseController> logger)
        {
            _courseService = courseService;
            _logger = logger;
        }

        /// <summary>
        /// Register for a course
        /// </summary>
        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<CourseRegistrationResponse>>> RegisterForCourse([FromBody] CourseRegistrationRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    return BadRequest(new ApiResponse<CourseRegistrationResponse>
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = errors
                    });
                }

                var result = await _courseService.RegisterForCourseAsync(request);
                
                if (result.Success)
                {
                    return Ok(result);
                }
                
                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in RegisterForCourse endpoint");
                return StatusCode(500, new ApiResponse<CourseRegistrationResponse>
                {
                    Success = false,
                    Message = "An internal server error occurred"
                });
            }
        }

        /// <summary>
        /// Get all available courses
        /// </summary>
        [HttpGet("available")]
        public async Task<ActionResult<ApiResponse<List<CourseResponse>>>> GetAvailableCourses()
        {
            try
            {
                var result = await _courseService.GetAvailableCoursesAsync();
                
                if (result.Success)
                {
                    return Ok(result);
                }
                
                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAvailableCourses endpoint");
                return StatusCode(500, new ApiResponse<List<CourseResponse>>
                {
                    Success = false,
                    Message = "An internal server error occurred"
                });
            }
        }

        /// <summary>
        /// Get user's course registrations (requires authentication)
        /// </summary>
        [HttpGet("my-registrations")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<List<CourseRegistrationResponse>>>> GetMyRegistrations()
        {
            try
            {
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new ApiResponse<List<CourseRegistrationResponse>>
                    {
                        Success = false,
                        Message = "User not authenticated"
                    });
                }

                var result = await _courseService.GetUserRegistrationsAsync(userId);
                
                if (result.Success)
                {
                    return Ok(result);
                }
                
                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetMyRegistrations endpoint");
                return StatusCode(500, new ApiResponse<List<CourseRegistrationResponse>>
                {
                    Success = false,
                    Message = "An internal server error occurred"
                });
            }
        }

        /// <summary>
        /// Get a specific registration by ID
        /// </summary>
        [HttpGet("registration/{registrationId}")]
        public async Task<ActionResult<ApiResponse<CourseRegistrationResponse>>> GetRegistration(string registrationId)
        {
            try
            {
                if (string.IsNullOrEmpty(registrationId))
                {
                    return BadRequest(new ApiResponse<CourseRegistrationResponse>
                    {
                        Success = false,
                        Message = "Registration ID is required"
                    });
                }

                var result = await _courseService.GetRegistrationByIdAsync(registrationId);
                
                if (result.Success)
                {
                    return Ok(result);
                }
                
                return NotFound(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetRegistration endpoint for {RegistrationId}", registrationId);
                return StatusCode(500, new ApiResponse<CourseRegistrationResponse>
                {
                    Success = false,
                    Message = "An internal server error occurred"
                });
            }
        }

        /// <summary>
        /// Update registration status (admin only)
        /// </summary>
        [HttpPut("registration/{registrationId}/status")]
        [Authorize] // In a real app, you'd add role-based authorization here
        public async Task<ActionResult<ApiResponse<bool>>> UpdateRegistrationStatus(
            string registrationId, 
            [FromBody] UpdateRegistrationStatusRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(registrationId))
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Registration ID is required"
                    });
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = errors
                    });
                }

                var result = await _courseService.UpdateRegistrationStatusAsync(registrationId, request.Status);
                
                if (result.Success)
                {
                    return Ok(result);
                }
                
                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateRegistrationStatus endpoint for {RegistrationId}", registrationId);
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = "An internal server error occurred"
                });
            }
        }

        /// <summary>
        /// Get all registrations with pagination (admin only)
        /// </summary>
        [HttpGet("registrations")]
        [Authorize] // In a real app, you'd add role-based authorization here
        public async Task<ActionResult<ApiResponse<GetRegistrationsResponse>>> GetAllRegistrations(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10)
        {
            try
            {
                if (page < 1) page = 1;
                if (pageSize < 1 || pageSize > 100) pageSize = 10;

                var result = await _courseService.GetAllRegistrationsAsync(page, pageSize);
                
                if (result.Success)
                {
                    return Ok(result);
                }
                
                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAllRegistrations endpoint");
                return StatusCode(500, new ApiResponse<GetRegistrationsResponse>
                {
                    Success = false,
                    Message = "An internal server error occurred"
                });
            }
        }
    }

    public class UpdateRegistrationStatusRequest
    {
        [Required(ErrorMessage = "Status is required")]
        [RegularExpression("^(pending|approved|rejected)$", ErrorMessage = "Status must be 'pending', 'approved', or 'rejected'")]
        public string Status { get; set; } = string.Empty;
    }
}
