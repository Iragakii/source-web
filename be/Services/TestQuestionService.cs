using MongoDB.Driver;
using WebComingAPI.Data;
using WebComingAPI.DTOs;
using WebComingAPI.Models;

namespace WebComingAPI.Services
{
    public class TestQuestionService : ITestQuestionService
    {
        private readonly MongoDbContext _context;

        public TestQuestionService(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TestQuestion>> GetQuestionsByTestTypeAsync(string testType)
        {
            return await _context.TestQuestions.Find(q => q.TestType == testType).ToListAsync();
        }

        public async Task<TestQuestion?> GetQuestionByIdAsync(string id)
        {
            return await _context.TestQuestions.Find(q => q.Id == id).FirstOrDefaultAsync();
        }

        public async Task<TestQuestion> CreateQuestionAsync(CreateTestQuestionDto questionDto)
        {
            var question = new TestQuestion
            {
                Question = questionDto.Question,
                Options = questionDto.Options,
                CorrectAnswer = questionDto.CorrectAnswer,
                Category = questionDto.Category,
                Difficulty = questionDto.Difficulty,
                Explanation = questionDto.Explanation,
                TestType = questionDto.TestType,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _context.TestQuestions.InsertOneAsync(question);
            return question;
        }

        public async Task<TestQuestion?> UpdateQuestionAsync(UpdateTestQuestionDto questionDto)
        {
            var filter = Builders<TestQuestion>.Filter.Eq(q => q.Id, questionDto.Id);
            var update = Builders<TestQuestion>.Update
                .Set(q => q.Question, questionDto.Question)
                .Set(q => q.Options, questionDto.Options)
                .Set(q => q.CorrectAnswer, questionDto.CorrectAnswer)
                .Set(q => q.Category, questionDto.Category)
                .Set(q => q.Difficulty, questionDto.Difficulty)
                .Set(q => q.Explanation, questionDto.Explanation)
                .Set(q => q.TestType, questionDto.TestType)
                .Set(q => q.UpdatedAt, DateTime.UtcNow);

            var result = await _context.TestQuestions.FindOneAndUpdateAsync(filter, update, new FindOneAndUpdateOptions<TestQuestion>
            {
                ReturnDocument = ReturnDocument.After
            });

            return result;
        }

        public async Task<bool> DeleteQuestionAsync(string id)
        {
            var result = await _context.TestQuestions.DeleteOneAsync(q => q.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task<IEnumerable<TestQuestion>> BulkImportQuestionsAsync(BulkImportTestQuestionsDto questionsDto)
        {
            var questions = questionsDto.Questions.Select(q => new TestQuestion
            {
                Question = q.Question,
                Options = q.Options,
                CorrectAnswer = q.CorrectAnswer,
                Category = q.Category,
                Difficulty = q.Difficulty,
                Explanation = q.Explanation,
                TestType = q.TestType,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }).ToList();

            await _context.TestQuestions.InsertManyAsync(questions);
            return questions;
        }

        public async Task<IEnumerable<TestQuestion>> ExportQuestionsAsync(string testType)
        {
            return await _context.TestQuestions.Find(q => q.TestType == testType).ToListAsync();
        }
    }
}
