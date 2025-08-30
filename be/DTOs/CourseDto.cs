using System.ComponentModel.DataAnnotations;

namespace WebComingAPI.DTOs
{
    public class CreateCourseRequest
    {
        [Required]
        [StringLength(50)]
        public string CourseId { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Duration { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Level { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Instructor { get; set; } = string.Empty;

        [Required]
        [Url]
        public string ImageUrl { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string VideoId { get; set; } = string.Empty;

        public bool IsVideo { get; set; } = true;
    }

    public class UpdateCourseRequest
    {
        [Required]
        [StringLength(50)]
        public string CourseId { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Duration { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Level { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Instructor { get; set; } = string.Empty;

        [Required]
        [Url]
        public string ImageUrl { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string VideoId { get; set; } = string.Empty;

        public bool IsVideo { get; set; } = true;
    }

    public class CreateVideoLessonRequest
    {
        [Required]
        [StringLength(50)]
        public string VideoId { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Url]
        public string VideoUrl { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Duration { get; set; } = string.Empty;

        [Required]
        [Range(1, int.MaxValue)]
        public int Order { get; set; }

        [Required]
        [StringLength(50)]
        public string CourseId { get; set; } = string.Empty;
    }

    public class UpdateVideoLessonRequest
    {
        [Required]
        [StringLength(50)]
        public string VideoId { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Url]
        public string VideoUrl { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Duration { get; set; } = string.Empty;

        [Required]
        [Range(1, int.MaxValue)]
        public int Order { get; set; }

        [Required]
        [StringLength(50)]
        public string CourseId { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;
    }

    public class UpdateUserRoleRequest
    {
        [Required]
        [StringLength(20)]
        public string Role { get; set; } = string.Empty;
    }

    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<string> Errors { get; set; } = new List<string>();
    }
}
