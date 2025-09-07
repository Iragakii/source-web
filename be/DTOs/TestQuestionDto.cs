using System.ComponentModel.DataAnnotations;

namespace WebComingAPI.DTOs
{
    public class TestQuestionDto
    {
        public string Id { get; set; } = string.Empty;
        public string Question { get; set; } = string.Empty;
        public List<string> Options { get; set; } = new List<string>();
        public int CorrectAnswer { get; set; }
        public string? Category { get; set; }
        public string? Difficulty { get; set; }
        public string? Explanation { get; set; }
        public string TestType { get; set; } = "IT";
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateTestQuestionDto
    {
        [Required]
        public string Question { get; set; } = string.Empty;

        [Required]
        [MinLength(2)]
        public List<string> Options { get; set; } = new List<string>();

        [Required]
        [Range(0, 3)]
        public int CorrectAnswer { get; set; }

        public string? Category { get; set; }

        public string? Difficulty { get; set; }

        public string? Explanation { get; set; }

        [Required]
        public string TestType { get; set; } = "IT";
    }

    public class UpdateTestQuestionDto
    {
        [Required]
        public string Id { get; set; } = string.Empty;

        [Required]
        public string Question { get; set; } = string.Empty;

        [Required]
        [MinLength(2)]
        public List<string> Options { get; set; } = new List<string>();

        [Required]
        [Range(0, 3)]
        public int CorrectAnswer { get; set; }

        public string? Category { get; set; }

        public string? Difficulty { get; set; }

        public string? Explanation { get; set; }

        [Required]
        public string TestType { get; set; } = "IT";
    }

    public class BulkImportTestQuestionsDto
    {
        [Required]
        public List<CreateTestQuestionDto> Questions { get; set; } = new List<CreateTestQuestionDto>();
    }
}
