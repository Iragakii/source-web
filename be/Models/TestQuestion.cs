using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WebComingAPI.Models
{
    public class TestQuestion
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("question")]
        public string Question { get; set; } = string.Empty;

        [BsonElement("options")]
        public List<string> Options { get; set; } = new List<string>();

        [BsonElement("correctAnswer")]
        public int CorrectAnswer { get; set; }

        [BsonElement("category")]
        public string? Category { get; set; }

        [BsonElement("difficulty")]
        public string? Difficulty { get; set; } // "Easy", "Medium", "Hard"

        [BsonElement("explanation")]
        public string? Explanation { get; set; }

        [BsonElement("testType")]
        public string TestType { get; set; } = "IT"; // "IT" or "Cybersecurity"

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
