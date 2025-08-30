using MongoDB.Driver;
using WebComingAPI.Data;
using WebComingAPI.Models;

namespace WebComingAPI.Services
{
    public interface IDataSeedService
    {
        Task SeedCoursesAsync();
        Task SeedVideosAsync();
        Task ClearAllDataAsync();
        Task ReseedAllDataAsync();
    }

    public class DataSeedService : IDataSeedService
    {
        private readonly MongoDbContext _context;
        private readonly ILogger<DataSeedService> _logger;

        public DataSeedService(MongoDbContext context, ILogger<DataSeedService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task SeedCoursesAsync()
        {
            try
            {
                // Check if courses already exist
                var existingCourses = await _context.Courses.CountDocumentsAsync(FilterDefinition<Course>.Empty);
                if (existingCourses > 0)
                {
                    _logger.LogInformation("Courses already exist ({Count}), skipping seeding", existingCourses);
                    return;
                }

                _logger.LogInformation("Seeding courses data...");

                var courses = new List<Course>
                {
                    // IT Courses (10 courses)
                    new Course
                    {
                        CourseId = "course-it-01",
                        Title = "Networking Essentials and Security",
                        Description = "Learn the fundamentals of networking and cybersecurity principles.",
                        Duration = "8 weeks",
                        Level = "Beginner",
                        Instructor = "John Smith",
                        ImageUrl = "https://i.pinimg.com/736x/63/1c/2d/631c2d5fc2599cff65f5144507dbce4e.jpg",
                        Category = "IT",
                        VideoId = "NET01",
                        IsVideo = true,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-30),
                        UpdatedAt = DateTime.UtcNow.AddDays(-30)
                    },
                    new Course
                    {
                        CourseId = "course-it-02",
                        Title = "Database Management with SQL & NoSQL",
                        Description = "Master database design, SQL queries, and NoSQL technologies.",
                        Duration = "10 weeks",
                        Level = "Intermediate",
                        Instructor = "Sarah Johnson",
                        ImageUrl = "https://i.pinimg.com/1200x/c2/31/48/c2314893161f270e6b8dd30f9087bc43.jpg",
                        Category = "IT",
                        VideoId = "DAT02",
                        IsVideo = false,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-29),
                        UpdatedAt = DateTime.UtcNow.AddDays(-29)
                    },
                    new Course
                    {
                        CourseId = "course-it-03",
                        Title = "Cloud Computing Fundamentals",
                        Description = "Introduction to cloud platforms, services, and deployment models.",
                        Duration = "12 weeks",
                        Level = "Intermediate",
                        Instructor = "Mike Chen",
                        ImageUrl = "https://i.pinimg.com/736x/48/ea/05/48ea0549b3a0985c635993ebfc698e7b.jpg",
                        Category = "IT",
                        VideoId = "CUL03",
                        IsVideo = true,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-28),
                        UpdatedAt = DateTime.UtcNow.AddDays(-28)
                    },
                    new Course
                    {
                        CourseId = "course-it-04",
                        Title = "Introduction to Cybersecurity",
                        Description = "Basic cybersecurity concepts, threats, and protection strategies.",
                        Duration = "6 weeks",
                        Level = "Beginner",
                        Instructor = "Lisa Wang",
                        ImageUrl = "https://i.pinimg.com/1200x/f0/7e/dd/f07edd3cf298b545f147914272bf20eb.jpg",
                        Category = "IT",
                        VideoId = "IT04",
                        IsVideo = false,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-27),
                        UpdatedAt = DateTime.UtcNow.AddDays(-27)
                    },
                    new Course
                    {
                        CourseId = "course-it-05",
                        Title = "Foundations of Information Technology",
                        Description = "Core IT concepts, hardware, software, and system administration.",
                        Duration = "8 weeks",
                        Level = "Beginner",
                        Instructor = "David Brown",
                        ImageUrl = "https://i.pinimg.com/1200x/71/d8/1f/71d81fdc8ae26b173cf5635502a4c2f6.jpg",
                        Category = "IT",
                        VideoId = "IT05",
                        IsVideo = true,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-26),
                        UpdatedAt = DateTime.UtcNow.AddDays(-26)
                    },
                    new Course
                    {
                        CourseId = "course-it-06",
                        Title = "Programming for IT Professionals (Python & Java)",
                        Description = "Learn programming fundamentals with Python and Java for IT applications.",
                        Duration = "14 weeks",
                        Level = "Intermediate",
                        Instructor = "Emily Davis",
                        ImageUrl = "https://i.pinimg.com/736x/5f/00/1b/5f001b48f1d2fe417a882e851157d939.jpg",
                        Category = "IT",
                        VideoId = "PRO87",
                        IsVideo = false,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-25),
                        UpdatedAt = DateTime.UtcNow.AddDays(-25)
                    },
                    new Course
                    {
                        CourseId = "course-it-07",
                        Title = "IT Systems Administration & Troubleshooting",
                        Description = "System administration, server management, and troubleshooting techniques.",
                        Duration = "10 weeks",
                        Level = "Advanced",
                        Instructor = "Robert Wilson",
                        ImageUrl = "https://i.pinimg.com/736x/cb/37/ef/cb37eff129a1b7facf8b2c4db28326bd.jpg",
                        Category = "IT",
                        VideoId = "SYS28",
                        IsVideo = true,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-24),
                        UpdatedAt = DateTime.UtcNow.AddDays(-24)
                    },
                    new Course
                    {
                        CourseId = "course-it-08",
                        Title = "Web Development & Deployment",
                        Description = "Full-stack web development, frameworks, and deployment strategies.",
                        Duration = "16 weeks",
                        Level = "Intermediate",
                        Instructor = "Jennifer Lee",
                        ImageUrl = "https://i.pinimg.com/1200x/25/33/04/253304c3c3c51e03dfda76acc818210a.jpg",
                        Category = "IT",
                        VideoId = "WEB39",
                        IsVideo = false,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-23),
                        UpdatedAt = DateTime.UtcNow.AddDays(-23)
                    },
                    new Course
                    {
                        CourseId = "course-it-09",
                        Title = "IT Project Management with Agile & Scrum",
                        Description = "Project management methodologies, Agile practices, and Scrum framework.",
                        Duration = "8 weeks",
                        Level = "Intermediate",
                        Instructor = "Mark Thompson",
                        ImageUrl = "https://i.pinimg.com/1200x/25/33/04/253304c3c3c51e03dfda76acc818210a.jpg",
                        Category = "IT",
                        VideoId = "MAG88",
                        IsVideo = false,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-22),
                        UpdatedAt = DateTime.UtcNow.AddDays(-22)
                    },
                    new Course
                    {
                        CourseId = "course-it-10",
                        Title = "Advanced Topics in IT Infrastructure",
                        Description = "Enterprise infrastructure, virtualization, and advanced networking.",
                        Duration = "12 weeks",
                        Level = "Advanced",
                        Instructor = "Alex Rodriguez",
                        ImageUrl = "https://i.pinimg.com/1200x/25/33/04/253304c3c3c51e03dfda76acc818210a.jpg",
                        Category = "IT",
                        VideoId = "JCroup",
                        IsVideo = false,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-21),
                        UpdatedAt = DateTime.UtcNow.AddDays(-21)
                    },
                    // CyberSecurity Courses (10 courses)
                    new Course
                    {
                        CourseId = "course-cyber-01",
                        Title = "Advanced Cybersecurity Fundamentals",
                        Description = "Comprehensive cybersecurity principles, risk assessment, and security frameworks.",
                        Duration = "10 weeks",
                        Level = "Intermediate",
                        Instructor = "Dr. Sarah Mitchell",
                        ImageUrl = "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
                        Category = "Cyber",
                        VideoId = "CYB01",
                        IsVideo = true,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-20),
                        UpdatedAt = DateTime.UtcNow.AddDays(-20)
                    },
                    new Course
                    {
                        CourseId = "course-cyber-02",
                        Title = "Ethical Hacking & Penetration Testing",
                        Description = "Learn ethical hacking techniques, vulnerability assessment, and penetration testing methodologies.",
                        Duration = "14 weeks",
                        Level = "Advanced",
                        Instructor = "James Parker",
                        ImageUrl = "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop",
                        Category = "Cyber",
                        VideoId = "CYB02",
                        IsVideo = false,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-19),
                        UpdatedAt = DateTime.UtcNow.AddDays(-19)
                    },
                    new Course
                    {
                        CourseId = "course-cyber-03",
                        Title = "Digital Forensics & Incident Response",
                        Description = "Learn digital evidence collection, forensic analysis, and incident response procedures.",
                        Duration = "12 weeks",
                        Level = "Advanced",
                        Instructor = "Mike Rodriguez",
                        ImageUrl = "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop",
                        Category = "Cyber",
                        VideoId = "CYB03",
                        IsVideo = true,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-18),
                        UpdatedAt = DateTime.UtcNow.AddDays(-18)
                    },
                    new Course
                    {
                        CourseId = "course-cyber-04",
                        Title = "Network Security & Threat Analysis",
                        Description = "Network security protocols, threat detection, and security monitoring.",
                        Duration = "10 weeks",
                        Level = "Intermediate",
                        Instructor = "Anna Thompson",
                        ImageUrl = "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop",
                        Category = "Cyber",
                        VideoId = "CYB04",
                        IsVideo = false,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-17),
                        UpdatedAt = DateTime.UtcNow.AddDays(-17)
                    },
                    new Course
                    {
                        CourseId = "course-cyber-05",
                        Title = "Malware Analysis & Reverse Engineering",
                        Description = "Advanced malware analysis techniques, reverse engineering, and threat intelligence.",
                        Duration = "16 weeks",
                        Level = "Advanced",
                        Instructor = "Dr. Kevin Zhang",
                        ImageUrl = "https://i.pinimg.com/736x/2e/c2/c7/2ec2c719887c58f8315137ba45ed76b0.jpg",
                        Category = "Cyber",
                        VideoId = "CYB05",
                        IsVideo = true,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-16),
                        UpdatedAt = DateTime.UtcNow.AddDays(-16)
                    },
                    new Course
                    {
                        CourseId = "course-cyber-06",
                        Title = "Security Operations Center (SOC) Management",
                        Description = "SOC operations, security monitoring, and incident management processes.",
                        Duration = "8 weeks",
                        Level = "Intermediate",
                        Instructor = "Rachel Green",
                        ImageUrl = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
                        Category = "Cyber",
                        VideoId = "CYB06",
                        IsVideo = false,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-15),
                        UpdatedAt = DateTime.UtcNow.AddDays(-15)
                    },
                    new Course
                    {
                        CourseId = "course-cyber-07",
                        Title = "Cloud Security & DevSecOps",
                        Description = "Cloud security best practices, DevSecOps integration, and secure development.",
                        Duration = "12 weeks",
                        Level = "Advanced",
                        Instructor = "Tom Anderson",
                        ImageUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
                        Category = "Cyber",
                        VideoId = "CYB07",
                        IsVideo = true,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-14),
                        UpdatedAt = DateTime.UtcNow.AddDays(-14)
                    },
                    new Course
                    {
                        CourseId = "course-cyber-08",
                        Title = "Cryptography & Secure Communications",
                        Description = "Cryptographic algorithms, secure communication protocols, and key management.",
                        Duration = "10 weeks",
                        Level = "Advanced",
                        Instructor = "Dr. Lisa Chen",
                        ImageUrl = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
                        Category = "Cyber",
                        VideoId = "CYB08",
                        IsVideo = false,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-13),
                        UpdatedAt = DateTime.UtcNow.AddDays(-13)
                    },
                    new Course
                    {
                        CourseId = "course-cyber-09",
                        Title = "Social Engineering & Human Factors",
                        Description = "Understanding social engineering attacks, human psychology, and security awareness.",
                        Duration = "6 weeks",
                        Level = "Intermediate",
                        Instructor = "Maria Garcia",
                        ImageUrl = "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop",
                        Category = "Cyber",
                        VideoId = "CYB09",
                        IsVideo = false,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-12),
                        UpdatedAt = DateTime.UtcNow.AddDays(-12)
                    },
                    new Course
                    {
                        CourseId = "course-cyber-10",
                        Title = "Cybersecurity Governance & Compliance",
                        Description = "Security governance frameworks, compliance requirements, and risk management.",
                        Duration = "8 weeks",
                        Level = "Intermediate",
                        Instructor = "Steven White",
                        ImageUrl = "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
                        Category = "Cyber",
                        VideoId = "CYB10",
                        IsVideo = false,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-11),
                        UpdatedAt = DateTime.UtcNow.AddDays(-11)
                    }
                };

                await _context.Courses.InsertManyAsync(courses);
                _logger.LogInformation("Successfully seeded {Count} courses", courses.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding courses");
                throw;
            }
        }

        public async Task SeedVideosAsync()
        {
            try
            {
                // Check if videos already exist
                var existingVideos = await _context.VideoLessons.CountDocumentsAsync(FilterDefinition<VideoLesson>.Empty);
                if (existingVideos > 0)
                {
                    _logger.LogInformation("Video lessons already exist ({Count}), skipping seeding", existingVideos);
                    return;
                }

                _logger.LogInformation("Seeding video lessons data...");

                var videos = new List<VideoLesson>
                {
                    // IT Course Videos (6 videos)
                    new VideoLesson
                    {
                        VideoId = "NET01-L01",
                        Title = "Introduction to Networking",
                        Description = "Basic concepts of computer networking and protocols.",
                        VideoUrl = "https://example.com/videos/net01-l01.mp4",
                        Duration = "15:30",
                        Order = 1,
                        CourseId = "course-it-01",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-30),
                        UpdatedAt = DateTime.UtcNow.AddDays(-30)
                    },
                    new VideoLesson
                    {
                        VideoId = "NET01-L02",
                        Title = "OSI Model Deep Dive",
                        Description = "Understanding the seven layers of the OSI model.",
                        VideoUrl = "https://example.com/videos/net01-l02.mp4",
                        Duration = "22:45",
                        Order = 2,
                        CourseId = "course-it-01",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-29),
                        UpdatedAt = DateTime.UtcNow.AddDays(-29)
                    },
                    new VideoLesson
                    {
                        VideoId = "CUL03-L01",
                        Title = "Cloud Computing Basics",
                        Description = "Introduction to cloud computing concepts and services.",
                        VideoUrl = "https://example.com/videos/cul03-l01.mp4",
                        Duration = "18:20",
                        Order = 1,
                        CourseId = "course-it-03",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-28),
                        UpdatedAt = DateTime.UtcNow.AddDays(-28)
                    },
                    new VideoLesson
                    {
                        VideoId = "IT05-L01",
                        Title = "IT Fundamentals Overview",
                        Description = "Core concepts in information technology.",
                        VideoUrl = "https://example.com/videos/it05-l01.mp4",
                        Duration = "25:15",
                        Order = 1,
                        CourseId = "course-it-05",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-27),
                        UpdatedAt = DateTime.UtcNow.AddDays(-27)
                    },
                    new VideoLesson
                    {
                        VideoId = "SYS28-L01",
                        Title = "System Administration Basics",
                        Description = "Introduction to system administration concepts.",
                        VideoUrl = "https://example.com/videos/sys28-l01.mp4",
                        Duration = "30:45",
                        Order = 1,
                        CourseId = "course-it-07",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-26),
                        UpdatedAt = DateTime.UtcNow.AddDays(-26)
                    },
                    new VideoLesson
                    {
                        VideoId = "SYS28-L02",
                        Title = "Server Management",
                        Description = "Managing servers and troubleshooting techniques.",
                        VideoUrl = "https://example.com/videos/sys28-l02.mp4",
                        Duration = "28:30",
                        Order = 2,
                        CourseId = "course-it-07",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-25),
                        UpdatedAt = DateTime.UtcNow.AddDays(-25)
                    },
                    // Cybersecurity Course Videos (6 videos)
                    new VideoLesson
                    {
                        VideoId = "CYB01-L01",
                        Title = "Cybersecurity Fundamentals",
                        Description = "Introduction to cybersecurity principles and frameworks.",
                        VideoUrl = "https://example.com/videos/cyb01-l01.mp4",
                        Duration = "20:15",
                        Order = 1,
                        CourseId = "course-cyber-01",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-24),
                        UpdatedAt = DateTime.UtcNow.AddDays(-24)
                    },
                    new VideoLesson
                    {
                        VideoId = "CYB01-L02",
                        Title = "Risk Assessment Techniques",
                        Description = "Methods for assessing cybersecurity risks.",
                        VideoUrl = "https://example.com/videos/cyb01-l02.mp4",
                        Duration = "24:30",
                        Order = 2,
                        CourseId = "course-cyber-01",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-23),
                        UpdatedAt = DateTime.UtcNow.AddDays(-23)
                    },
                    new VideoLesson
                    {
                        VideoId = "CYB03-L01",
                        Title = "Digital Evidence Collection",
                        Description = "Proper procedures for collecting digital evidence.",
                        VideoUrl = "https://example.com/videos/cyb03-l01.mp4",
                        Duration = "28:15",
                        Order = 1,
                        CourseId = "course-cyber-03",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-22),
                        UpdatedAt = DateTime.UtcNow.AddDays(-22)
                    },
                    new VideoLesson
                    {
                        VideoId = "CYB05-L01",
                        Title = "Malware Analysis Introduction",
                        Description = "Basic techniques for analyzing malware samples.",
                        VideoUrl = "https://example.com/videos/cyb05-l01.mp4",
                        Duration = "32:45",
                        Order = 1,
                        CourseId = "course-cyber-05",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-21),
                        UpdatedAt = DateTime.UtcNow.AddDays(-21)
                    },
                    new VideoLesson
                    {
                        VideoId = "CYB07-L01",
                        Title = "Cloud Security Basics",
                        Description = "Introduction to cloud security concepts and best practices.",
                        VideoUrl = "https://example.com/videos/cyb07-l01.mp4",
                        Duration = "26:20",
                        Order = 1,
                        CourseId = "course-cyber-07",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-20),
                        UpdatedAt = DateTime.UtcNow.AddDays(-20)
                    },
                    new VideoLesson
                    {
                        VideoId = "CYB07-L02",
                        Title = "DevSecOps Integration",
                        Description = "Integrating security into DevOps workflows.",
                        VideoUrl = "https://example.com/videos/cyb07-l02.mp4",
                        Duration = "29:10",
                        Order = 2,
                        CourseId = "course-cyber-07",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-19),
                        UpdatedAt = DateTime.UtcNow.AddDays(-19)
                    }
                };

                await _context.VideoLessons.InsertManyAsync(videos);
                _logger.LogInformation("Successfully seeded {Count} video lessons", videos.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding video lessons");
                throw;
            }
        }

        public async Task ClearAllDataAsync()
        {
            try
            {
                _logger.LogInformation("Clearing all data from database...");
                
                // Clear all collections
                await _context.Courses.DeleteManyAsync(FilterDefinition<Course>.Empty);
                await _context.VideoLessons.DeleteManyAsync(FilterDefinition<VideoLesson>.Empty);
                
                _logger.LogInformation("Successfully cleared all data from database");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing data from database");
                throw;
            }
        }

        public async Task ReseedAllDataAsync()
        {
            try
            {
                _logger.LogInformation("Starting complete database reseed...");
                
                // Clear existing data
                await ClearAllDataAsync();
                
                // Reseed with fresh data
                await SeedCoursesAsync();
                await SeedVideosAsync();
                
                _logger.LogInformation("Successfully completed database reseed");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during database reseed");
                throw;
            }
        }
    }
}
