using MongoDB.Driver;
using WebComingAPI.Data;
using WebComingAPI.Models;
using WebComingAPI.Models.DTOs;
using WebComingAPI.DTOs;

namespace WebComingAPI.Services
{
    public class TestResultService : ITestResultService
    {
        private readonly MongoDbContext _context;
        private readonly ILogger<TestResultService> _logger;

        public TestResultService(MongoDbContext context, ILogger<TestResultService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ApiResponse<TestResultResponse>> SubmitTestResultAsync(TestResultSubmissionRequest request)
        {
            try
            {
                var percentage = (double)request.Score / request.TotalQuestions * 100;

                var testResult = new TestResult
                {
                    Email = request.Email.ToLower().Trim(),
                    Name = request.Name.Trim(),
                    Score = request.Score,
                    TotalQuestions = request.TotalQuestions,
                    Percentage = Math.Round(percentage, 2),
                    TimeTaken = request.TimeTaken,
                    TestType = request.TestType,
                    SubmittedAt = DateTime.UtcNow,
                    IsActive = true
                };

                await _context.TestResults.InsertOneAsync(testResult);

                var response = new TestResultResponse
                {
                    Id = testResult.Id,
                    Email = testResult.Email,
                    Name = testResult.Name,
                    Score = testResult.Score,
                    TotalQuestions = testResult.TotalQuestions,
                    Percentage = testResult.Percentage,
                    TimeTaken = testResult.TimeTaken,
                    TestType = testResult.TestType,
                    SubmittedAt = testResult.SubmittedAt
                };

                _logger.LogInformation("Test result submitted successfully for {Email} with score {Score}/{TotalQuestions}", 
                    request.Email, request.Score, request.TotalQuestions);

                return new ApiResponse<TestResultResponse>
                {
                    Success = true,
                    Message = "Test result submitted successfully!",
                    Data = response
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error submitting test result for {Email}", request.Email);
                return new ApiResponse<TestResultResponse>
                {
                    Success = false,
                    Message = "An error occurred while submitting your test result."
                };
            }
        }

        public async Task<ApiResponse<List<TestResultResponse>>> GetTestResultsByEmailAsync(string email)
        {
            try
            {
                var testResults = await _context.TestResults
                    .Find(tr => tr.Email == email.ToLower().Trim() && tr.IsActive)
                    .SortByDescending(tr => tr.SubmittedAt)
                    .ToListAsync();

                var response = testResults.Select(tr => new TestResultResponse
                {
                    Id = tr.Id,
                    Email = tr.Email,
                    Name = tr.Name,
                    Score = tr.Score,
                    TotalQuestions = tr.TotalQuestions,
                    Percentage = tr.Percentage,
                    TimeTaken = tr.TimeTaken,
                    TestType = tr.TestType,
                    SubmittedAt = tr.SubmittedAt
                }).ToList();

                return new ApiResponse<List<TestResultResponse>>
                {
                    Success = true,
                    Data = response
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving test results for {Email}", email);
                return new ApiResponse<List<TestResultResponse>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving test results."
                };
            }
        }

        public async Task<ApiResponse<TestResultResponse>> GetTestResultByIdAsync(string id)
        {
            try
            {
                var testResult = await _context.TestResults
                    .Find(tr => tr.Id == id && tr.IsActive)
                    .FirstOrDefaultAsync();

                if (testResult == null)
                {
                    return new ApiResponse<TestResultResponse>
                    {
                        Success = false,
                        Message = "Test result not found."
                    };
                }

                var response = new TestResultResponse
                {
                    Id = testResult.Id,
                    Email = testResult.Email,
                    Name = testResult.Name,
                    Score = testResult.Score,
                    TotalQuestions = testResult.TotalQuestions,
                    Percentage = testResult.Percentage,
                    TimeTaken = testResult.TimeTaken,
                    TestType = testResult.TestType,
                    SubmittedAt = testResult.SubmittedAt
                };

                return new ApiResponse<TestResultResponse>
                {
                    Success = true,
                    Data = response
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving test result {Id}", id);
                return new ApiResponse<TestResultResponse>
                {
                    Success = false,
                    Message = "An error occurred while retrieving the test result."
                };
            }
        }

        public async Task<ApiResponse<GetTestResultsResponse>> GetAllTestResultsAsync(int page = 1, int pageSize = 10)
        {
            try
            {
                var skip = (page - 1) * pageSize;
                
                var totalCount = await _context.TestResults.CountDocumentsAsync(tr => tr.IsActive);
                
                var testResults = await _context.TestResults
                    .Find(tr => tr.IsActive)
                    .SortByDescending(tr => tr.SubmittedAt)
                    .Skip(skip)
                    .Limit(pageSize)
                    .ToListAsync();

                var testResultResponses = testResults.Select(tr => new TestResultResponse
                {
                    Id = tr.Id,
                    Email = tr.Email,
                    Name = tr.Name,
                    Score = tr.Score,
                    TotalQuestions = tr.TotalQuestions,
                    Percentage = tr.Percentage,
                    TimeTaken = tr.TimeTaken,
                    TestType = tr.TestType,
                    SubmittedAt = tr.SubmittedAt
                }).ToList();

                var response = new GetTestResultsResponse
                {
                    TestResults = testResultResponses,
                    TotalCount = (int)totalCount,
                    Page = page,
                    PageSize = pageSize
                };

                return new ApiResponse<GetTestResultsResponse>
                {
                    Success = true,
                    Data = response
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all test results");
                return new ApiResponse<GetTestResultsResponse>
                {
                    Success = false,
                    Message = "An error occurred while retrieving test results."
                };
            }
        }

        public async Task<ApiResponse<bool>> DeleteTestResultAsync(string id)
        {
            try
            {
                var filter = Builders<TestResult>.Filter.Eq(tr => tr.Id, id);
                var update = Builders<TestResult>.Update.Set(tr => tr.IsActive, false);

                var result = await _context.TestResults.UpdateOneAsync(filter, update);

                if (result.MatchedCount == 0)
                {
                    return new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Test result not found."
                    };
                }

                _logger.LogInformation("Test result {Id} deleted successfully", id);
                return new ApiResponse<bool>
                {
                    Success = true,
                    Data = true,
                    Message = "Test result deleted successfully."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting test result {Id}", id);
                return new ApiResponse<bool>
                {
                    Success = false,
                    Message = "An error occurred while deleting the test result."
                };
            }
        }
    }
}
