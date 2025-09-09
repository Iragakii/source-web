using System.Collections.Generic;
using System.Threading.Tasks;
using WebComingAPI.Models;
using WebComingAPI.Data;
using MongoDB.Driver;

namespace WebComingAPI.Services
{
    public class DataSeedService : IDataSeedService
    {
        private readonly MongoDbContext _context;
        private readonly CourseDataSeedService _courseDataSeedService;

        public DataSeedService(MongoDbContext context, CourseDataSeedService courseDataSeedService)
        {
            _context = context;
            _courseDataSeedService = courseDataSeedService;
        }

        public async Task SeedDefaultQuestionsAsync()
        {
            var existingCount = await _context.TestQuestions.CountDocumentsAsync(FilterDefinition<TestQuestion>.Empty);
            if (existingCount > 0)
            {
                // Already seeded
                return;
            }

            var defaultQuestions = new List<TestQuestion>
            {
                // IT Questions
                new TestQuestion
                {
                    Question = "What does HTML stand for?",
                    Options = new List<string> { "Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language" },
                    CorrectAnswer = 0,
                    Category = "Web Development",
                    Difficulty = "Easy",
                    TestType = "IT",
                    CreatedAt = System.DateTime.UtcNow,
                    UpdatedAt = System.DateTime.UtcNow
                },
                new TestQuestion
                {
                    Question = "Which of the following is NOT a programming language?",
                    Options = new List<string> { "Python", "JavaScript", "HTML", "Java" },
                    CorrectAnswer = 2,
                    Category = "Programming",
                    Difficulty = "Easy",
                    TestType = "IT",
                    CreatedAt = System.DateTime.UtcNow,
                    UpdatedAt = System.DateTime.UtcNow
                },
                new TestQuestion
                {
                    Question = "What does SQL stand for?",
                    Options = new List<string> { "Structured Query Language", "Simple Query Language", "Standard Query Language", "Sequential Query Language" },
                    CorrectAnswer = 0,
                    Category = "Database",
                    Difficulty = "Easy",
                    TestType = "IT",
                    CreatedAt = System.DateTime.UtcNow,
                    UpdatedAt = System.DateTime.UtcNow
                },
                new TestQuestion
                {
                    Question = "Which HTTP status code indicates 'Not Found'?",
                    Options = new List<string> { "200", "301", "404", "500" },
                    CorrectAnswer = 2,
                    Category = "Web Development",
                    Difficulty = "Medium",
                    TestType = "IT",
                    CreatedAt = System.DateTime.UtcNow,
                    UpdatedAt = System.DateTime.UtcNow
                },
                new TestQuestion
                {
                    Question = "What is the time complexity of binary search?",
                    Options = new List<string> { "O(n)", "O(log n)", "O(n²)", "O(1)" },
                    CorrectAnswer = 1,
                    Category = "Algorithms",
                    Difficulty = "Medium",
                    TestType = "IT",
                    CreatedAt = System.DateTime.UtcNow,
                    UpdatedAt = System.DateTime.UtcNow
                },
                new TestQuestion
                {
                    Question = "Which of these is a NoSQL database?",
                    Options = new List<string> { "MySQL", "PostgreSQL", "MongoDB", "SQLite" },
                    CorrectAnswer = 2,
                    Category = "Database",
                    Difficulty = "Medium",
                    TestType = "IT",
                    CreatedAt = System.DateTime.UtcNow,
                    UpdatedAt = System.DateTime.UtcNow
                },
                new TestQuestion
                {
                    Question = "What does API stand for?",
                    Options = new List<string> { "Application Programming Interface", "Advanced Programming Interface", "Application Process Interface", "Automated Programming Interface" },
                    CorrectAnswer = 0,
                    Category = "Software Development",
                    Difficulty = "Easy",
                    TestType = "IT",
                    CreatedAt = System.DateTime.UtcNow,
                    UpdatedAt = System.DateTime.UtcNow
                },
                new TestQuestion
                {
                    Question = "Which port is commonly used for HTTPS?",
                    Options = new List<string> { "80", "443", "21", "25" },
                    CorrectAnswer = 1,
                    Category = "Networking",
                    Difficulty = "Medium",
                    TestType = "IT",
                    CreatedAt = System.DateTime.UtcNow,
                    UpdatedAt = System.DateTime.UtcNow
                },
                new TestQuestion
                {
                    Question = "What is the main purpose of Git?",
                    Options = new List<string> { "Database management", "Version control", "Web hosting", "Code compilation" },
                    CorrectAnswer = 1,
                    Category = "Development Tools",
                    Difficulty = "Easy",
                    TestType = "IT",
                    CreatedAt = System.DateTime.UtcNow,
                    UpdatedAt = System.DateTime.UtcNow
                },
                new TestQuestion
                {
                    Question = "Which of these is NOT a valid CSS property?",
                    Options = new List<string> { "margin", "padding", "border", "content-align" },
                    CorrectAnswer = 3,
                    Category = "Web Development",
                    Difficulty = "Medium",
                    TestType = "IT",
                    CreatedAt = System.DateTime.UtcNow,
                    UpdatedAt = System.DateTime.UtcNow
                },
                new TestQuestion
                {
                    Question = "What does RAM stand for?",
                    Options = new List<string> { "Random Access Memory", "Read Access Memory", "Rapid Access Memory", "Remote Access Memory" },
                    CorrectAnswer = 0,
                    Category = "Hardware",
                    Difficulty = "Easy",
                    TestType = "IT",
                    CreatedAt = System.DateTime.UtcNow,
                    UpdatedAt = System.DateTime.UtcNow
                },
                new TestQuestion
                {
                    Question = "Which sorting algorithm has the best average-case time complexity?",
                    Options = new List<string> { "Bubble Sort", "Selection Sort", "Quick Sort", "Insertion Sort" },
                    CorrectAnswer = 2,
                    Category = "Algorithms",
                    Difficulty = "Hard",
                    TestType = "IT",
                    CreatedAt = System.DateTime.UtcNow,
                    UpdatedAt = System.DateTime.UtcNow
                },
                new TestQuestion
                {
                    Question = "What is the purpose of a firewall?",
                    Options = new List<string> { "Speed up internet connection", "Store data permanently", "Control network traffic", "Compile source code" },
                    CorrectAnswer = 2,
                    Category = "Security",
                    Difficulty = "Medium",
                    TestType = "IT",
                    CreatedAt = System.DateTime.UtcNow,
                    UpdatedAt = System.DateTime.UtcNow
                },
                new TestQuestion
                {
                    Question = "Which of these is a JavaScript framework?",
                    Options = new List<string> { "Django", "Laravel", "React", "Spring" },
                    CorrectAnswer = 2,
                    Category = "Web Development",
                    Difficulty = "Easy",
                    TestType = "IT",
                    CreatedAt = System.DateTime.UtcNow,
                    UpdatedAt = System.DateTime.UtcNow
                },
                new TestQuestion
                {
                    Question = "What does CRUD stand for in database operations?",
                    Options = new List<string> { "Create, Read, Update, Delete", "Copy, Read, Update, Delete", "Create, Remove, Update, Delete", "Create, Read, Upload, Delete" },
                    CorrectAnswer = 0,
                    Category = "Database",
                    Difficulty = "Medium",
                    TestType = "IT",
                    CreatedAt = System.DateTime.UtcNow,
                    UpdatedAt = System.DateTime.UtcNow
                },
                new TestQuestion
                {
                    Question = "Which protocol is used for secure email transmission?",
                    Options = new List<string> { "HTTP", "FTP", "SMTP", "HTTPS" },
                    CorrectAnswer = 3,
                    Category = "Networking",
                    Difficulty = "Hard",
                    TestType = "IT",
                    CreatedAt = System.DateTime.UtcNow,
                    UpdatedAt = System.DateTime.UtcNow
                },

                // Cybersecurity Questions
                new TestQuestion
                {
                    Question = "What is a firewall used for?",
                    Options = new List<string> { "Speed up internet connection", "Store data permanently", "Control network traffic", "Compile source code" },
                    CorrectAnswer = 2,
                    Category = "Security",
                    Difficulty = "Medium",
                    TestType = "Cybersecurity",
                    CreatedAt = System.DateTime.UtcNow,
                    UpdatedAt = System.DateTime.UtcNow
                },
                new TestQuestion
                {
                    Question = "Which of the following is a common type of phishing attack?",
                    Options = new List<string> { "Spear phishing", "Whaling", "Vishing", "All of the above" },
                    CorrectAnswer = 3,
                    Category = "Security",
                    Difficulty = "Medium",
                    TestType = "Cybersecurity",
                    CreatedAt = System.DateTime.UtcNow,
                    UpdatedAt = System.DateTime.UtcNow
                },
                new TestQuestion
                {
                    Question = "What does VPN stand for?",
                    Options = new List<string> { "Virtual Private Network", "Very Private Network", "Virtual Public Network", "Verified Private Network" },
                    CorrectAnswer = 0,
                    Category = "Networking",
                    Difficulty = "Easy",
                    TestType = "Cybersecurity",
                    CreatedAt = System.DateTime.UtcNow,
                    UpdatedAt = System.DateTime.UtcNow
                },
                new TestQuestion
                {
                    Question = "Which protocol is commonly used to secure web traffic?",
                    Options = new List<string> { "HTTP", "FTP", "HTTPS", "SMTP" },
                    CorrectAnswer = 2,
                    Category = "Networking",
                    Difficulty = "Easy",
                    TestType = "Cybersecurity",
                    CreatedAt = System.DateTime.UtcNow,
                    UpdatedAt = System.DateTime.UtcNow
                }
            };

            await _context.TestQuestions.InsertManyAsync(defaultQuestions);
        }

        public async Task SeedCoursesAsync()
        {
            await _courseDataSeedService.SeedCoursesAsync();
        }

        public async Task SeedVideosAsync()
        {
            await _courseDataSeedService.SeedVideosAsync();
        }

        public async Task ReseedAllDataAsync()
        {
            // Clear all data first
            await ClearAllDataAsync();

            // Then reseed all data
            await SeedCoursesAsync();
            await SeedVideosAsync();
            await SeedDefaultQuestionsAsync();
        }

        public async Task ClearAllDataAsync()
        {
            // Clear all collections
            await _context.TestQuestions.DeleteManyAsync(FilterDefinition<TestQuestion>.Empty);
            await _courseDataSeedService.ClearAllDataAsync();
        }
    }
}
