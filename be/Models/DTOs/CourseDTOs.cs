using System.ComponentModel.DataAnnotations;

namespace WebComingAPI.Models.DTOs
{
    public class CourseRegistrationRequest
    {
        [Required(ErrorMessage = "Student name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Student name must be between 2 and 100 characters")]
        public string StudentName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Phone number is required")]
        [Phone(ErrorMessage = "Invalid phone number format")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Course name is required")]
        public string CourseName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Experience level is required")]
        public string Experience { get; set; } = string.Empty;

        public string? Notes { get; set; }
    }

    public class CourseRegistrationResponse
    {
        public string Id { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string CourseName { get; set; } = string.Empty;
        public string Experience { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime RegistrationDate { get; set; }
        public string? Notes { get; set; }
    }

    public class CourseResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class GetRegistrationsResponse
    {
        public List<CourseRegistrationResponse> Registrations { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}
