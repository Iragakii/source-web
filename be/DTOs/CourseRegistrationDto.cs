using System.ComponentModel.DataAnnotations;

namespace WebComingAPI.DTOs
{
    public class CourseRegistrationRequest
    {
        [Required]
        [StringLength(100)]
        public string StudentName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string CourseName { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Experience { get; set; } = string.Empty;

        [StringLength(500)]
        public string Notes { get; set; } = string.Empty;
    }

    public class CourseRegistrationResponse
    {
        public string Id { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string CourseName { get; set; } = string.Empty;
        public string Experience { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public DateTime RegistrationDate { get; set; }
        public string Status { get; set; } = "Active";
    }
}
