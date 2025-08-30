using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WebComingAPI.Models
{
    public class Course
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("courseId")]
        public string CourseId { get; set; } = string.Empty; // e.g., "course-it-01", "course-cyber-03"

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("title")]
        public string Title { get; set; } = string.Empty;

        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;

        [BsonElement("duration")]
        public string Duration { get; set; } = string.Empty;

        [BsonElement("level")]
        public string Level { get; set; } = string.Empty;

        [BsonElement("instructor")]
        public string Instructor { get; set; } = string.Empty;

        [BsonElement("imageUrl")]
        public string ImageUrl { get; set; } = string.Empty;

        [BsonElement("category")]
        public string Category { get; set; } = string.Empty; // "IT", "Cyber", etc.

        [BsonElement("videoId")]
        public string VideoId { get; set; } = string.Empty; // For card display

        [BsonElement("isVideo")]
        public bool IsVideo { get; set; } = true;

        [BsonElement("lessons")]
        public List<VideoLesson> Lessons { get; set; } = new List<VideoLesson>();

        [BsonElement("isActive")]
        public bool IsActive { get; set; } = true;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class VideoLesson
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("videoId")]
        public string VideoId { get; set; } = string.Empty;

        [BsonElement("title")]
        public string Title { get; set; } = string.Empty;

        [BsonElement("duration")]
        public string Duration { get; set; } = string.Empty;

        [BsonElement("videoUrl")]
        public string VideoUrl { get; set; } = string.Empty;

        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;

        [BsonElement("order")]
        public int Order { get; set; } = 0;

        [BsonElement("courseId")]
        public string CourseId { get; set; } = string.Empty;

        [BsonElement("isActive")]
        public bool IsActive { get; set; } = true;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class CourseRegistration
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("userId")]
        public string? UserId { get; set; }

        [BsonElement("studentName")]
        public string StudentName { get; set; } = string.Empty;

        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;

        [BsonElement("phone")]
        public string Phone { get; set; } = string.Empty;

        [BsonElement("courseName")]
        public string CourseName { get; set; } = string.Empty;

        [BsonElement("experience")]
        public string Experience { get; set; } = string.Empty;

        [BsonElement("status")]
        public string Status { get; set; } = "pending"; // pending, approved, rejected

        [BsonElement("registrationDate")]
        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;

        [BsonElement("notes")]
        public string? Notes { get; set; }
    }
}
