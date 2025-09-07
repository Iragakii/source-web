using WebComingAPI.DTOs;
using WebComingAPI.Models;

namespace WebComingAPI.Services
{
    public interface ITestQuestionService
    {
        Task<IEnumerable<TestQuestion>> GetQuestionsByTestTypeAsync(string testType);
        Task<TestQuestion?> GetQuestionByIdAsync(string id);
        Task<TestQuestion> CreateQuestionAsync(CreateTestQuestionDto questionDto);
        Task<TestQuestion?> UpdateQuestionAsync(UpdateTestQuestionDto questionDto);
        Task<bool> DeleteQuestionAsync(string id);
        Task<IEnumerable<TestQuestion>> BulkImportQuestionsAsync(BulkImportTestQuestionsDto questionsDto);
        Task<IEnumerable<TestQuestion>> ExportQuestionsAsync(string testType);
    }
}
