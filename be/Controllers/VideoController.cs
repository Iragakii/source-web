using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebComingAPI.Models;
using WebComingAPI.Services;
using WebComingAPI.DTOs;

namespace WebComingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VideoController : ControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly ILogger<VideoController> _logger;

        public VideoController(ICourseService courseService, ILogger<VideoController> logger)
        {
            _courseService = courseService;
            _logger = logger;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ApiResponse<List<VideoLesson>>>> GetAllVideoLessons()
        {
            try
            {
                // Get all courses and their video lessons
                var courses = await _courseService.GetAllCoursesAsync();
                var allVideoLessons = new List<VideoLesson>();

                foreach (var course in courses)
                {
                    var videoLessons = await _courseService.GetVideoLessonsByCourseIdAsync(course.Id);
                    allVideoLessons.AddRange(videoLessons);
                }

                return Ok(new ApiResponse<List<VideoLesson>>
                {
                    Success = true,
                    Data = allVideoLessons,
                    Message = "Video lessons retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving video lessons");
                return StatusCode(500, new ApiResponse<List<VideoLesson>>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<VideoLesson>>> GetVideoLessonById(string id)
        {
            try
            {
                var videoLesson = await _courseService.GetVideoLessonByIdAsync(id);
                if (videoLesson == null)
                {
                    return NotFound(new ApiResponse<VideoLesson>
                    {
                        Success = false,
                        Message = "Video lesson not found"
                    });
                }

                return Ok(new ApiResponse<VideoLesson>
                {
                    Success = true,
                    Data = videoLesson,
                    Message = "Video lesson retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving video lesson with id {VideoId}", id);
                return StatusCode(500, new ApiResponse<VideoLesson>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpGet("course/{courseId}")]
        public async Task<ActionResult<ApiResponse<List<VideoLesson>>>> GetVideoLessonsByCourseId(string courseId)
        {
            try
            {
                var videoLessons = await _courseService.GetVideoLessonsByCourseIdAsync(courseId);
                return Ok(new ApiResponse<List<VideoLesson>>
                {
                    Success = true,
                    Data = videoLessons,
                    Message = "Video lessons retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving video lessons for course {CourseId}", courseId);
                return StatusCode(500, new ApiResponse<List<VideoLesson>>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ApiResponse<VideoLesson>>> CreateVideoLesson([FromBody] CreateVideoLessonRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new ApiResponse<VideoLesson>
                    {
                        Success = false,
                        Message = "Invalid video lesson data"
                    });
                }

                // Verify that the course exists
                var course = await _courseService.GetCourseByIdAsync(request.CourseId);
                if (course == null)
                {
                    return BadRequest(new ApiResponse<VideoLesson>
                    {
                        Success = false,
                        Message = "Course not found"
                    });
                }

                var videoLesson = new VideoLesson
                {
                    VideoId = request.VideoId,
                    Title = request.Title,
                    Description = request.Description,
                    VideoUrl = request.VideoUrl,
                    Duration = request.Duration,
                    Order = request.Order,
                    CourseId = request.CourseId,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var createdVideoLesson = await _courseService.CreateVideoLessonAsync(videoLesson);
                return CreatedAtAction(nameof(GetVideoLessonById), new { id = createdVideoLesson.Id }, 
                    new ApiResponse<VideoLesson>
                    {
                        Success = true,
                        Data = createdVideoLesson,
                        Message = "Video lesson created successfully"
                    });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating video lesson");
                return StatusCode(500, new ApiResponse<VideoLesson>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ApiResponse<VideoLesson>>> UpdateVideoLesson(string id, [FromBody] UpdateVideoLessonRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new ApiResponse<VideoLesson>
                    {
                        Success = false,
                        Message = "Invalid video lesson data"
                    });
                }

                var existingVideoLesson = await _courseService.GetVideoLessonByIdAsync(id);
                if (existingVideoLesson == null)
                {
                    return NotFound(new ApiResponse<VideoLesson>
                    {
                        Success = false,
                        Message = "Video lesson not found"
                    });
                }

                // Verify that the course exists
                var course = await _courseService.GetCourseByIdAsync(request.CourseId);
                if (course == null)
                {
                    return BadRequest(new ApiResponse<VideoLesson>
                    {
                        Success = false,
                        Message = "Course not found"
                    });
                }

                existingVideoLesson.VideoId = request.VideoId;
                existingVideoLesson.Title = request.Title;
                existingVideoLesson.Description = request.Description;
                existingVideoLesson.VideoUrl = request.VideoUrl;
                existingVideoLesson.Duration = request.Duration;
                existingVideoLesson.Order = request.Order;
                existingVideoLesson.CourseId = request.CourseId;
                existingVideoLesson.UpdatedAt = DateTime.UtcNow;

                var updatedVideoLesson = await _courseService.UpdateVideoLessonAsync(existingVideoLesson);
                return Ok(new ApiResponse<VideoLesson>
                {
                    Success = true,
                    Data = updatedVideoLesson,
                    Message = "Video lesson updated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating video lesson with id {VideoId}", id);
                return StatusCode(500, new ApiResponse<VideoLesson>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteVideoLesson(string id)
        {
            try
            {
                var videoLesson = await _courseService.GetVideoLessonByIdAsync(id);
                if (videoLesson == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Video lesson not found"
                    });
                }

                await _courseService.DeleteVideoLessonAsync(id);
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Video lesson deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting video lesson with id {VideoId}", id);
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpPatch("{id}/toggle-active")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ApiResponse<VideoLesson>>> ToggleVideoLessonActive(string id)
        {
            try
            {
                var videoLesson = await _courseService.GetVideoLessonByIdAsync(id);
                if (videoLesson == null)
                {
                    return NotFound(new ApiResponse<VideoLesson>
                    {
                        Success = false,
                        Message = "Video lesson not found"
                    });
                }

                videoLesson.IsActive = !videoLesson.IsActive;
                videoLesson.UpdatedAt = DateTime.UtcNow;

                var updatedVideoLesson = await _courseService.UpdateVideoLessonAsync(videoLesson);
                return Ok(new ApiResponse<VideoLesson>
                {
                    Success = true,
                    Data = updatedVideoLesson,
                    Message = $"Video lesson {(updatedVideoLesson.IsActive ? "activated" : "deactivated")} successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling video lesson active status with id {VideoId}", id);
                return StatusCode(500, new ApiResponse<VideoLesson>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }
    }
}
