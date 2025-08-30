using MongoDB.Driver;
using WebComingAPI.Data;
using WebComingAPI.Models;

namespace WebComingAPI.Services
{
    public class CourseService : ICourseService
    {
        private readonly MongoDbContext _context;
        private readonly ILogger<CourseService> _logger;

        public CourseService(MongoDbContext context, ILogger<CourseService> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Course methods
        public async Task<List<Course>> GetAllCoursesAsync()
        {
            try
            {
                _logger.LogInformation("Fetching all courses from database");
                var courses = await _context.Courses.Find(_ => true).ToListAsync();
                _logger.LogInformation("Found {CourseCount} courses", courses.Count);
                return courses;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching courses from database");
                throw;
            }
        }

        public async Task<Course?> GetCourseByIdAsync(string id)
        {
            try
            {
                return await _context.Courses.Find(c => c.Id == id).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching course by ID {CourseId}", id);
                throw;
            }
        }

        public async Task<Course?> GetCourseByCourseIdAsync(string courseId)
        {
            try
            {
                return await _context.Courses.Find(c => c.CourseId == courseId).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching course by CourseId {CourseId}", courseId);
                throw;
            }
        }

        public async Task<List<Course>> GetCoursesByCategoryAsync(string category)
        {
            try
            {
                return await _context.Courses.Find(c => c.Category.ToLower() == category.ToLower()).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching courses by category {Category}", category);
                throw;
            }
        }

        public async Task<Course> CreateCourseAsync(Course course)
        {
            try
            {
                await _context.Courses.InsertOneAsync(course);
                return course;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating course");
                throw;
            }
        }

        public async Task<Course> UpdateCourseAsync(Course course)
        {
            try
            {
                await _context.Courses.ReplaceOneAsync(c => c.Id == course.Id, course);
                return course;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating course {CourseId}", course.Id);
                throw;
            }
        }

        public async Task DeleteCourseAsync(string id)
        {
            try
            {
                await _context.Courses.DeleteOneAsync(c => c.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting course {CourseId}", id);
                throw;
            }
        }

        // Video lesson methods
        public async Task<List<VideoLesson>> GetVideoLessonsByCourseIdAsync(string courseId)
        {
            try
            {
                return await _context.VideoLessons.Find(v => v.CourseId == courseId).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching video lessons for course {CourseId}", courseId);
                throw;
            }
        }

        public async Task<VideoLesson?> GetVideoLessonByIdAsync(string id)
        {
            try
            {
                return await _context.VideoLessons.Find(v => v.Id == id).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching video lesson by ID {VideoId}", id);
                throw;
            }
        }

        public async Task<VideoLesson> CreateVideoLessonAsync(VideoLesson videoLesson)
        {
            try
            {
                await _context.VideoLessons.InsertOneAsync(videoLesson);
                return videoLesson;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating video lesson");
                throw;
            }
        }

        public async Task<VideoLesson> UpdateVideoLessonAsync(VideoLesson videoLesson)
        {
            try
            {
                await _context.VideoLessons.ReplaceOneAsync(v => v.Id == videoLesson.Id, videoLesson);
                return videoLesson;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating video lesson {VideoId}", videoLesson.Id);
                throw;
            }
        }

        public async Task DeleteVideoLessonAsync(string id)
        {
            try
            {
                await _context.VideoLessons.DeleteOneAsync(v => v.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting video lesson {VideoId}", id);
                throw;
            }
        }
    }
}
