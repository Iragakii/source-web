using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WebComingAPI.Models
{
    public class CourseRegistration
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("userId")]
        public string UserId { get; set; } = string.Empty;

        [BsonElement("courseId")]
        public string CourseId { get; set; } = string.Empty;

        [BsonElement("registrationDate")]
        public DateTime RegistrationDate { get; set; }

        [BsonElement("status")]
        public string Status { get; set; } = "Active"; // Active, Completed, Cancelled

        [BsonElement("progress")]
        public int Progress { get; set; } = 0; // Percentage 0-100

        [BsonElement("completionDate")]
        public DateTime? CompletionDate { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
