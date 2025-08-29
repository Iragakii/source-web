using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WebComingAPI.Models
{
    public class TestResult
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("score")]
        public int Score { get; set; }

        [BsonElement("totalQuestions")]
        public int TotalQuestions { get; set; }

        [BsonElement("percentage")]
        public double Percentage { get; set; }

        [BsonElement("timeTaken")]
        public int TimeTaken { get; set; } // in seconds

        [BsonElement("testType")]
        public string TestType { get; set; } = "IT";

        [BsonElement("submittedAt")]
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("isActive")]
        public bool IsActive { get; set; } = true;
    }
}
