using MongoDB.Driver;
using WebComingAPI.Data;
using WebComingAPI.Models;

namespace WebComingAPI.Services
{
    public class CourseService : ICourseService
    {
        private readonly IMongoCollection<Course> _courses;
        private readonly IMongoCollection<VideoLesson> _videoLessons;

        public CourseService(MongoDbContext context)
        {
            _courses = context.Courses;
            _videoLessons = context.VideoLessons;
        }

        public async Task<List<Course>> GetAllCoursesAsync()
        {
            return await _courses.Find(_ => true).ToListAsync();
        }

        public async Task<Course?> GetCourseByIdAsync(string id)
        {
            return await _courses.Find(c => c.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Course?> GetCourseByCourseIdAsync(string courseId)
        {
            return await _courses.Find(c => c.CourseId == courseId).FirstOrDefaultAsync();
        }

        public async Task<List<Course>> GetCoursesByCategoryAsync(string category)
        {
            return await _courses.Find(c => c.Category == category && c.IsActive).ToListAsync();
        }

        public async Task<Course> CreateCourseAsync(Course course)
        {
            await _courses.InsertOneAsync(course);
            return course;
        }

        public async Task<Course> UpdateCourseAsync(Course course)
        {
            await _courses.ReplaceOneAsync(c => c.Id == course.Id, course);
            return course;
        }

        public async Task DeleteCourseAsync(string id)
        {
            // Also delete associated video lessons
            await _videoLessons.DeleteManyAsync(v => v.CourseId == id);
            await _courses.DeleteOneAsync(c => c.Id == id);
        }

        public async Task<List<VideoLesson>> GetVideoLessonsByCourseIdAsync(string courseId)
        {
            return await _videoLessons
                .Find(v => v.CourseId == courseId)
                .SortBy(v => v.Order)
                .ToListAsync();
        }

        public async Task<VideoLesson?> GetVideoLessonByIdAsync(string id)
        {
            return await _videoLessons.Find(v => v.Id == id).FirstOrDefaultAsync();
        }

        public async Task<VideoLesson> CreateVideoLessonAsync(VideoLesson videoLesson)
        {
            await _videoLessons.InsertOneAsync(videoLesson);
            return videoLesson;
        }

        public async Task<VideoLesson> UpdateVideoLessonAsync(VideoLesson videoLesson)
        {
            await _videoLessons.ReplaceOneAsync(v => v.Id == videoLesson.Id, videoLesson);
            return videoLesson;
        }

        public async Task DeleteVideoLessonAsync(string id)
        {
            await _videoLessons.DeleteOneAsync(v => v.Id == id);
        }
    }
}
