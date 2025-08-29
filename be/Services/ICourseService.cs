using WebComingAPI.Models;
using WebComingAPI.Models.DTOs;

namespace WebComingAPI.Services
{
    public interface ICourseService
    {
        Task<ApiResponse<CourseRegistrationResponse>> RegisterForCourseAsync(CourseRegistrationRequest request);
        Task<ApiResponse<List<CourseResponse>>> GetAvailableCoursesAsync();
        Task<ApiResponse<List<CourseRegistrationResponse>>> GetUserRegistrationsAsync(string userId);
        Task<ApiResponse<CourseRegistrationResponse>> GetRegistrationByIdAsync(string registrationId);
        Task<ApiResponse<bool>> UpdateRegistrationStatusAsync(string registrationId, string status);
        Task<ApiResponse<GetRegistrationsResponse>> GetAllRegistrationsAsync(int page = 1, int pageSize = 10);
    }
}
