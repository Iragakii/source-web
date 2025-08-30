using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebComingAPI.Models;
using WebComingAPI.Services;
using WebComingAPI.DTOs;

namespace WebComingAPI.Controllers
{
    [ApiController]
    [Route("api/courses")]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly ILogger<CourseController> _logger;

        public CourseController(ICourseService courseService, ILogger<CourseController> logger)
        {
            _courseService = courseService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<Course>>>> GetAllCourses()
        {
            try
            {
                _logger.LogInformation("Retrieving all courses");
                var courses = await _courseService.GetAllCoursesAsync();
                
                return Ok(new ApiResponse<List<Course>>
                {
                    Success = true,
                    Data = courses,
                    Message = $"Successfully retrieved {courses.Count} courses"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving courses");
                return StatusCode(500, new ApiResponse<List<Course>>
                {
                    Success = false,
                    Message = $"Error retrieving courses: {ex.Message}"
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Course>>> GetCourseById(string id)
        {
            try
            {
                var course = await _courseService.GetCourseByIdAsync(id);
                if (course == null)
                {
                    return NotFound(new ApiResponse<Course>
                    {
                        Success = false,
                        Message = "Course not found"
                    });
                }

                return Ok(new ApiResponse<Course>
                {
                    Success = true,
                    Data = course,
                    Message = "Course retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving course {CourseId}", id);
                return StatusCode(500, new ApiResponse<Course>
                {
                    Success = false,
                    Message = $"Error retrieving course: {ex.Message}"
                });
            }
        }

        [HttpGet("category/{category}")]
        public async Task<ActionResult<ApiResponse<List<Course>>>> GetCoursesByCategory(string category)
        {
            try
            {
                var courses = await _courseService.GetCoursesByCategoryAsync(category);
                return Ok(new ApiResponse<List<Course>>
                {
                    Success = true,
                    Data = courses,
                    Message = $"Retrieved {courses.Count} courses in {category} category"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving courses by category {Category}", category);
                return StatusCode(500, new ApiResponse<List<Course>>
                {
                    Success = false,
                    Message = $"Error retrieving courses: {ex.Message}"
                });
            }
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ApiResponse<Course>>> CreateCourse([FromBody] CreateCourseRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new ApiResponse<Course>
                    {
                        Success = false,
                        Message = "Invalid course data"
                    });
                }

                var course = new Course
                {
                    CourseId = request.CourseId,
                    Title = request.Title,
                    Description = request.Description,
                    Duration = request.Duration,
                    Level = request.Level,
                    Instructor = request.Instructor,
                    ImageUrl = request.ImageUrl,
                    Category = request.Category,
                    VideoId = request.VideoId,
                    IsVideo = request.IsVideo,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var createdCourse = await _courseService.CreateCourseAsync(course);
                return CreatedAtAction(nameof(GetCourseById), new { id = createdCourse.Id }, 
                    new ApiResponse<Course>
                    {
                        Success = true,
                        Data = createdCourse,
                        Message = "Course created successfully"
                    });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating course");
                return StatusCode(500, new ApiResponse<Course>
                {
                    Success = false,
                    Message = $"Error creating course: {ex.Message}"
                });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ApiResponse<Course>>> UpdateCourse(string id, [FromBody] UpdateCourseRequest request)
        {
            try
            {
                var existingCourse = await _courseService.GetCourseByIdAsync(id);
                if (existingCourse == null)
                {
                    return NotFound(new ApiResponse<Course>
                    {
                        Success = false,
                        Message = "Course not found"
                    });
                }

                existingCourse.CourseId = request.CourseId;
                existingCourse.Title = request.Title;
                existingCourse.Description = request.Description;
                existingCourse.Duration = request.Duration;
                existingCourse.Level = request.Level;
                existingCourse.Instructor = request.Instructor;
                existingCourse.ImageUrl = request.ImageUrl;
                existingCourse.Category = request.Category;
                existingCourse.VideoId = request.VideoId;
                existingCourse.IsVideo = request.IsVideo;
                existingCourse.UpdatedAt = DateTime.UtcNow;

                var updatedCourse = await _courseService.UpdateCourseAsync(existingCourse);
                return Ok(new ApiResponse<Course>
                {
                    Success = true,
                    Data = updatedCourse,
                    Message = "Course updated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating course {CourseId}", id);
                return StatusCode(500, new ApiResponse<Course>
                {
                    Success = false,
                    Message = $"Error updating course: {ex.Message}"
                });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteCourse(string id)
        {
            try
            {
                var course = await _courseService.GetCourseByIdAsync(id);
                if (course == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Course not found"
                    });
                }

                await _courseService.DeleteCourseAsync(id);
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Course deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting course {CourseId}", id);
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Error deleting course: {ex.Message}"
                });
            }
        }
    }
}
