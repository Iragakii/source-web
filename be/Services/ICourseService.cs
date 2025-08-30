using WebComingAPI.Models;

namespace WebComingAPI.Services
{
    public interface ICourseService
    {
        Task<List<Course>> GetAllCoursesAsync();
        Task<Course?> GetCourseByIdAsync(string id);
        Task<Course?> GetCourseByCourseIdAsync(string courseId);
        Task<List<Course>> GetCoursesByCategoryAsync(string category);
        Task<Course> CreateCourseAsync(Course course);
        Task<Course> UpdateCourseAsync(Course course);
        Task DeleteCourseAsync(string id);
        Task<List<VideoLesson>> GetVideoLessonsByCourseIdAsync(string courseId);
        Task<VideoLesson?> GetVideoLessonByIdAsync(string id);
        Task<VideoLesson> CreateVideoLessonAsync(VideoLesson videoLesson);
        Task<VideoLesson> UpdateVideoLessonAsync(VideoLesson videoLesson);
        Task DeleteVideoLessonAsync(string id);
    }
}
