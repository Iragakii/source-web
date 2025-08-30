using System.ComponentModel.DataAnnotations;

namespace WebComingAPI.Models.DTOs
{
    public class TestResultSubmissionRequest
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Score is required")]
        [Range(0, int.MaxValue, ErrorMessage = "Score must be a positive number")]
        public int Score { get; set; }

        [Required(ErrorMessage = "Total questions is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Total questions must be greater than 0")]
        public int TotalQuestions { get; set; }

        [Required(ErrorMessage = "Time taken is required")]
        [Range(0, int.MaxValue, ErrorMessage = "Time taken must be a positive number")]
        public int TimeTaken { get; set; } // in seconds

        public string TestType { get; set; } = "IT";
    }

    public class TestResultResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int Score { get; set; }
        public int TotalQuestions { get; set; }
        public double Percentage { get; set; }
        public int TimeTaken { get; set; }
        public string TestType { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }
    }

    public class GetTestResultsResponse
    {
        public List<TestResultResponse> TestResults { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}
