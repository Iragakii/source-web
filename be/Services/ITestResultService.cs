using WebComingAPI.Models.DTOs;

namespace WebComingAPI.Services
{
    public interface ITestResultService
    {
        Task<ApiResponse<TestResultResponse>> SubmitTestResultAsync(TestResultSubmissionRequest request);
        Task<ApiResponse<List<TestResultResponse>>> GetTestResultsByEmailAsync(string email);
        Task<ApiResponse<TestResultResponse>> GetTestResultByIdAsync(string id);
        Task<ApiResponse<GetTestResultsResponse>> GetAllTestResultsAsync(int page = 1, int pageSize = 10);
        Task<ApiResponse<bool>> DeleteTestResultAsync(string id);
    }
}
