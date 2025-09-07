using System.Threading.Tasks;

namespace WebComingAPI.Services
{
    public interface IDataSeedService
    {
        Task SeedCoursesAsync();
        Task SeedVideosAsync();
        Task SeedDefaultQuestionsAsync();
        Task ReseedAllDataAsync();
        Task ClearAllDataAsync();
    }
}
