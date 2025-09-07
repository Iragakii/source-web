using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebComingAPI.DTOs;
using WebComingAPI.Services;

namespace WebComingAPI.Controllers
{
    [ApiController]
    [Route("api/test-questions")]
    [AllowAnonymous] // Temporarily allow anonymous access for testing
    public class TestQuestionController : ControllerBase
    {
        private readonly ITestQuestionService _testQuestionService;

        public TestQuestionController(ITestQuestionService testQuestionService)
        {
            _testQuestionService = testQuestionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetQuestions([FromQuery] string testType)
        {
            try
            {
                var questions = await _testQuestionService.GetQuestionsByTestTypeAsync(testType);
                var questionDtos = questions.Select(q => new TestQuestionDto
                {
                    Id = q.Id,
                    Question = q.Question,
                    Options = q.Options,
                    CorrectAnswer = q.CorrectAnswer,
                    Category = q.Category,
                    Difficulty = q.Difficulty,
                    Explanation = q.Explanation,
                    TestType = q.TestType,
                    CreatedAt = q.CreatedAt,
                    UpdatedAt = q.UpdatedAt
                });

                return Ok(new
                {
                    success = true,
                    data = questionDtos,
                    message = "Questions retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Error retrieving questions: {ex.Message}"
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuestion(string id)
        {
            try
            {
                var question = await _testQuestionService.GetQuestionByIdAsync(id);
                if (question == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Question not found"
                    });
                }

                var questionDto = new TestQuestionDto
                {
                    Id = question.Id,
                    Question = question.Question,
                    Options = question.Options,
                    CorrectAnswer = question.CorrectAnswer,
                    Category = question.Category,
                    Difficulty = question.Difficulty,
                    Explanation = question.Explanation,
                    TestType = question.TestType,
                    CreatedAt = question.CreatedAt,
                    UpdatedAt = question.UpdatedAt
                };

                return Ok(new
                {
                    success = true,
                    data = questionDto,
                    message = "Question retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Error retrieving question: {ex.Message}"
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateQuestion([FromBody] CreateTestQuestionDto questionDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid question data",
                        errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                    });
                }

                var question = await _testQuestionService.CreateQuestionAsync(questionDto);
                var resultDto = new TestQuestionDto
                {
                    Id = question.Id,
                    Question = question.Question,
                    Options = question.Options,
                    CorrectAnswer = question.CorrectAnswer,
                    Category = question.Category,
                    Difficulty = question.Difficulty,
                    Explanation = question.Explanation,
                    TestType = question.TestType,
                    CreatedAt = question.CreatedAt,
                    UpdatedAt = question.UpdatedAt
                };

                return CreatedAtAction(nameof(GetQuestion), new { id = question.Id }, new
                {
                    success = true,
                    data = resultDto,
                    message = "Question created successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Error creating question: {ex.Message}"
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestion(string id, [FromBody] UpdateTestQuestionDto questionDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid question data",
                        errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                    });
                }

                questionDto.Id = id;
                var question = await _testQuestionService.UpdateQuestionAsync(questionDto);
                if (question == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Question not found"
                    });
                }

                var resultDto = new TestQuestionDto
                {
                    Id = question.Id,
                    Question = question.Question,
                    Options = question.Options,
                    CorrectAnswer = question.CorrectAnswer,
                    Category = question.Category,
                    Difficulty = question.Difficulty,
                    Explanation = question.Explanation,
                    TestType = question.TestType,
                    CreatedAt = question.CreatedAt,
                    UpdatedAt = question.UpdatedAt
                };

                return Ok(new
                {
                    success = true,
                    data = resultDto,
                    message = "Question updated successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Error updating question: {ex.Message}"
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(string id)
        {
            try
            {
                var result = await _testQuestionService.DeleteQuestionAsync(id);
                if (!result)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Question not found"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Question deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Error deleting question: {ex.Message}"
                });
            }
        }

        [HttpPost("bulk")]
        public async Task<IActionResult> BulkImportQuestions([FromBody] BulkImportTestQuestionsDto questionsDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid questions data",
                        errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                    });
                }

                var questions = await _testQuestionService.BulkImportQuestionsAsync(questionsDto);
                var questionDtos = questions.Select(q => new TestQuestionDto
                {
                    Id = q.Id,
                    Question = q.Question,
                    Options = q.Options,
                    CorrectAnswer = q.CorrectAnswer,
                    Category = q.Category,
                    Difficulty = q.Difficulty,
                    Explanation = q.Explanation,
                    TestType = q.TestType,
                    CreatedAt = q.CreatedAt,
                    UpdatedAt = q.UpdatedAt
                });

                return Ok(new
                {
                    success = true,
                    data = questionDtos,
                    message = $"{questions.Count()} questions imported successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Error importing questions: {ex.Message}"
                });
            }
        }

        [HttpGet("export")]
        public async Task<IActionResult> ExportQuestions([FromQuery] string testType)
        {
            try
            {
                var questions = await _testQuestionService.ExportQuestionsAsync(testType);
                var questionDtos = questions.Select(q => new TestQuestionDto
                {
                    Id = q.Id,
                    Question = q.Question,
                    Options = q.Options,
                    CorrectAnswer = q.CorrectAnswer,
                    Category = q.Category,
                    Difficulty = q.Difficulty,
                    Explanation = q.Explanation,
                    TestType = q.TestType,
                    CreatedAt = q.CreatedAt,
                    UpdatedAt = q.UpdatedAt
                });

                return Ok(new
                {
                    success = true,
                    data = questionDtos,
                    message = "Questions exported successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Error exporting questions: {ex.Message}"
                });
            }
        }
    }
}
