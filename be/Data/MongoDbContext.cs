using MongoDB.Driver;
using WebComingAPI.Models;

namespace WebComingAPI.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IConfiguration configuration)
        {
            var connectionString = configuration.GetSection("MongoDB:ConnectionString").Value;
            var databaseName = configuration.GetSection("MongoDB:DatabaseName").Value;

            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(databaseName);
        }

        public IMongoCollection<User> Users => _database.GetCollection<User>("users");

        // Add other collections here as needed
        // public IMongoCollection<Course> Courses => _database.GetCollection<Course>("courses");
    }
}
