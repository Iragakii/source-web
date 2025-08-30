using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebComingAPI.Models;
using WebComingAPI.Services;
using WebComingAPI.DTOs;

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

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<Course>>>> GetAllCourses()
        {
            try
            {
                var courses = await _courseService.GetAllCoursesAsync();
                return Ok(new ApiResponse<List<Course>>
                {
                    Success = true,
                    Data = courses,
                    Message = "Courses retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving courses");
                return StatusCode(500, new ApiResponse<List<Course>>
                {
                    Success = false,
                    Message = "Internal server error"
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
                _logger.LogError(ex, "Error retrieving course with id {CourseId}", id);
                return StatusCode(500, new ApiResponse<Course>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpGet("course-id/{courseId}")]
        public async Task<ActionResult<ApiResponse<Course>>> GetCourseByCourseId(string courseId)
        {
            try
            {
                var course = await _courseService.GetCourseByCourseIdAsync(courseId);
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
                _logger.LogError(ex, "Error retrieving course with courseId {CourseId}", courseId);
                return StatusCode(500, new ApiResponse<Course>
                {
                    Success = false,
                    Message = "Internal server error"
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

                // Check if course with same courseId already exists
                var existingCourse = await _courseService.GetCourseByCourseIdAsync(request.CourseId);
                if (existingCourse != null)
                {
                    return Conflict(new ApiResponse<Course>
                    {
                        Success = false,
                        Message = "Course with this ID already exists"
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
                    Message = "Internal server error"
                });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ApiResponse<Course>>> UpdateCourse(string id, [FromBody] UpdateCourseRequest request)
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

                var existingCourse = await _courseService.GetCourseByIdAsync(id);
                if (existingCourse == null)
                {
                    return NotFound(new ApiResponse<Course>
                    {
                        Success = false,
                        Message = "Course not found"
                    });
                }

                // Check if another course with same courseId exists (excluding current course)
                var courseWithSameId = await _courseService.GetCourseByCourseIdAsync(request.CourseId);
                if (courseWithSameId != null && courseWithSameId.Id != id)
                {
                    return Conflict(new ApiResponse<Course>
                    {
                        Success = false,
                        Message = "Another course with this ID already exists"
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
                _logger.LogError(ex, "Error updating course with id {CourseId}", id);
                return StatusCode(500, new ApiResponse<Course>
                {
                    Success = false,
                    Message = "Internal server error"
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
                _logger.LogError(ex, "Error deleting course with id {CourseId}", id);
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpPatch("{id}/toggle-active")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ApiResponse<Course>>> ToggleCourseActive(string id)
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

                course.IsActive = !course.IsActive;
                course.UpdatedAt = DateTime.UtcNow;

                var updatedCourse = await _courseService.UpdateCourseAsync(course);
                return Ok(new ApiResponse<Course>
                {
                    Success = true,
                    Data = updatedCourse,
                    Message = $"Course {(updatedCourse.IsActive ? "activated" : "deactivated")} successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling course active status with id {CourseId}", id);
                return StatusCode(500, new ApiResponse<Course>
                {
                    Success = false,
                    Message = "Internal server error"
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
                    Message = "Courses retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving courses by category {Category}", category);
                return StatusCode(500, new ApiResponse<List<Course>>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }
    }
}
