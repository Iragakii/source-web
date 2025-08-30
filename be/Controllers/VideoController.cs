using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebComingAPI.Models;
using WebComingAPI.Services;
using WebComingAPI.DTOs;

namespace WebComingAPI.Controllers
{
    [ApiController]
    [Route("api/videos")]
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
        public async Task<ActionResult<ApiResponse<List<VideoLesson>>>> GetAllVideoLessons()
        {
            try
            {
                _logger.LogInformation("Retrieving all video lessons");
                
                // Get all courses and their video lessons
                var courses = await _courseService.GetAllCoursesAsync();
                var allVideoLessons = new List<VideoLesson>();

                foreach (var course in courses)
                {
                    var videoLessons = await _courseService.GetVideoLessonsByCourseIdAsync(course.CourseId);
                    allVideoLessons.AddRange(videoLessons);
                }

                return Ok(new ApiResponse<List<VideoLesson>>
                {
                    Success = true,
                    Data = allVideoLessons,
                    Message = $"Successfully retrieved {allVideoLessons.Count} video lessons"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving video lessons");
                return StatusCode(500, new ApiResponse<List<VideoLesson>>
                {
                    Success = false,
                    Message = $"Error retrieving video lessons: {ex.Message}"
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
                _logger.LogError(ex, "Error retrieving video lesson {VideoId}", id);
                return StatusCode(500, new ApiResponse<VideoLesson>
                {
                    Success = false,
                    Message = $"Error retrieving video lesson: {ex.Message}"
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
                    Message = $"Retrieved {videoLessons.Count} video lessons for course"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving video lessons for course {CourseId}", courseId);
                return StatusCode(500, new ApiResponse<List<VideoLesson>>
                {
                    Success = false,
                    Message = $"Error retrieving video lessons: {ex.Message}"
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
                    Message = $"Error creating video lesson: {ex.Message}"
                });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ApiResponse<VideoLesson>>> UpdateVideoLesson(string id, [FromBody] UpdateVideoLessonRequest request)
        {
            try
            {
                var existingVideoLesson = await _courseService.GetVideoLessonByIdAsync(id);
                if (existingVideoLesson == null)
                {
                    return NotFound(new ApiResponse<VideoLesson>
                    {
                        Success = false,
                        Message = "Video lesson not found"
                    });
                }

                existingVideoLesson.VideoId = request.VideoId;
                existingVideoLesson.Title = request.Title;
                existingVideoLesson.Description = request.Description;
                existingVideoLesson.VideoUrl = request.VideoUrl;
                existingVideoLesson.Duration = request.Duration;
                existingVideoLesson.Order = request.Order;
                existingVideoLesson.CourseId = request.CourseId;
                existingVideoLesson.IsActive = request.IsActive;
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
                _logger.LogError(ex, "Error updating video lesson {VideoId}", id);
                return StatusCode(500, new ApiResponse<VideoLesson>
                {
                    Success = false,
                    Message = $"Error updating video lesson: {ex.Message}"
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
                _logger.LogError(ex, "Error deleting video lesson {VideoId}", id);
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Error deleting video lesson: {ex.Message}"
                });
            }
        }
    }
}
