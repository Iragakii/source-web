using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WebComingAPI.Models
{
    public class Course
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;

        [BsonElement("duration")]
        public string Duration { get; set; } = string.Empty;

        [BsonElement("level")]
        public string Level { get; set; } = string.Empty;

        [BsonElement("isActive")]
        public bool IsActive { get; set; } = true;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
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
