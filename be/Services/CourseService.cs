using MongoDB.Driver;
using WebComingAPI.Data;
using WebComingAPI.Models;
using WebComingAPI.Models.DTOs;
using System.Security.Claims;

namespace WebComingAPI.Services
{
    public class CourseService : ICourseService
    {
        private readonly MongoDbContext _context;
        private readonly ILogger<CourseService> _logger;

        public CourseService(MongoDbContext context, ILogger<CourseService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ApiResponse<CourseRegistrationResponse>> RegisterForCourseAsync(CourseRegistrationRequest request)
        {
            try
            {
                // Check if user already registered for this course with the same email
                var existingRegistration = await _context.CourseRegistrations
                    .Find(r => r.Email == request.Email && r.CourseName == request.CourseName)
                    .FirstOrDefaultAsync();

                if (existingRegistration != null)
                {
                    return new ApiResponse<CourseRegistrationResponse>
                    {
                        Success = false,
                        Message = "You have already registered for this course with this email address."
                    };
                }

                var registration = new CourseRegistration
                {
                    StudentName = request.StudentName,
                    Email = request.Email,
                    Phone = request.Phone,
                    CourseName = request.CourseName,
                    Experience = request.Experience,
                    Notes = request.Notes,
                    Status = "pending",
                    RegistrationDate = DateTime.UtcNow
                };

                await _context.CourseRegistrations.InsertOneAsync(registration);

                var response = new CourseRegistrationResponse
                {
                    Id = registration.Id,
                    StudentName = registration.StudentName,
                    Email = registration.Email,
                    Phone = registration.Phone,
                    CourseName = registration.CourseName,
                    Experience = registration.Experience,
                    Status = registration.Status,
                    RegistrationDate = registration.RegistrationDate,
                    Notes = registration.Notes
                };

                _logger.LogInformation("Course registration created successfully for {Email}", request.Email);
                return new ApiResponse<CourseRegistrationResponse>
                {
                    Success = true,
                    Message = "Course registration submitted successfully!",
                    Data = response
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating course registration for {Email}", request.Email);
                return new ApiResponse<CourseRegistrationResponse>
                {
                    Success = false,
                    Message = "An error occurred while processing your registration."
                };
            }
        }

        public async Task<ApiResponse<List<CourseResponse>>> GetAvailableCoursesAsync()
        {
            try
            {
                var courses = await _context.Courses
                    .Find(c => c.IsActive)
                    .ToListAsync();

                var response = courses.Select(c => new CourseResponse
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    Duration = c.Duration,
                    Level = c.Level,
                    IsActive = c.IsActive
                }).ToList();

                return new ApiResponse<List<CourseResponse>>
                {
                    Success = true,
                    Data = response
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving available courses");
                return new ApiResponse<List<CourseResponse>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving courses."
                };
            }
        }

        public async Task<ApiResponse<List<CourseRegistrationResponse>>> GetUserRegistrationsAsync(string userId)
        {
            try
            {
                var registrations = await _context.CourseRegistrations
                    .Find(r => r.UserId == userId)
                    .SortByDescending(r => r.RegistrationDate)
                    .ToListAsync();

                var response = registrations.Select(r => new CourseRegistrationResponse
                {
                    Id = r.Id,
                    StudentName = r.StudentName,
                    Email = r.Email,
                    Phone = r.Phone,
                    CourseName = r.CourseName,
                    Experience = r.Experience,
                    Status = r.Status,
                    RegistrationDate = r.RegistrationDate,
                    Notes = r.Notes
                }).ToList();

                return new ApiResponse<List<CourseRegistrationResponse>>
                {
                    Success = true,
                    Data = response
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user registrations for {UserId}", userId);
                return new ApiResponse<List<CourseRegistrationResponse>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving your registrations."
                };
            }
        }

        public async Task<ApiResponse<CourseRegistrationResponse>> GetRegistrationByIdAsync(string registrationId)
        {
            try
            {
                var registration = await _context.CourseRegistrations
                    .Find(r => r.Id == registrationId)
                    .FirstOrDefaultAsync();

                if (registration == null)
                {
                    return new ApiResponse<CourseRegistrationResponse>
                    {
                        Success = false,
                        Message = "Registration not found."
                    };
                }

                var response = new CourseRegistrationResponse
                {
                    Id = registration.Id,
                    StudentName = registration.StudentName,
                    Email = registration.Email,
                    Phone = registration.Phone,
                    CourseName = registration.CourseName,
                    Experience = registration.Experience,
                    Status = registration.Status,
                    RegistrationDate = registration.RegistrationDate,
                    Notes = registration.Notes
                };

                return new ApiResponse<CourseRegistrationResponse>
                {
                    Success = true,
                    Data = response
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving registration {RegistrationId}", registrationId);
                return new ApiResponse<CourseRegistrationResponse>
                {
                    Success = false,
                    Message = "An error occurred while retrieving the registration."
                };
            }
        }

        public async Task<ApiResponse<bool>> UpdateRegistrationStatusAsync(string registrationId, string status)
        {
            try
            {
                var filter = Builders<CourseRegistration>.Filter.Eq(r => r.Id, registrationId);
                var update = Builders<CourseRegistration>.Update.Set(r => r.Status, status);

                var result = await _context.CourseRegistrations.UpdateOneAsync(filter, update);

                if (result.MatchedCount == 0)
                {
                    return new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Registration not found."
                    };
                }

                _logger.LogInformation("Registration {RegistrationId} status updated to {Status}", registrationId, status);
                return new ApiResponse<bool>
                {
                    Success = true,
                    Data = true,
                    Message = "Registration status updated successfully."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating registration status for {RegistrationId}", registrationId);
                return new ApiResponse<bool>
                {
                    Success = false,
                    Message = "An error occurred while updating the registration status."
                };
            }
        }

        public async Task<ApiResponse<GetRegistrationsResponse>> GetAllRegistrationsAsync(int page = 1, int pageSize = 10)
        {
            try
            {
                var skip = (page - 1) * pageSize;
                
                var totalCount = await _context.CourseRegistrations.CountDocumentsAsync(FilterDefinition<CourseRegistration>.Empty);
                
                var registrations = await _context.CourseRegistrations
                    .Find(FilterDefinition<CourseRegistration>.Empty)
                    .SortByDescending(r => r.RegistrationDate)
                    .Skip(skip)
                    .Limit(pageSize)
                    .ToListAsync();

                var registrationResponses = registrations.Select(r => new CourseRegistrationResponse
                {
                    Id = r.Id,
                    StudentName = r.StudentName,
                    Email = r.Email,
                    Phone = r.Phone,
                    CourseName = r.CourseName,
                    Experience = r.Experience,
                    Status = r.Status,
                    RegistrationDate = r.RegistrationDate,
                    Notes = r.Notes
                }).ToList();

                var response = new GetRegistrationsResponse
                {
                    Registrations = registrationResponses,
                    TotalCount = (int)totalCount,
                    Page = page,
                    PageSize = pageSize
                };

                return new ApiResponse<GetRegistrationsResponse>
                {
                    Success = true,
                    Data = response
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all registrations");
                return new ApiResponse<GetRegistrationsResponse>
                {
                    Success = false,
                    Message = "An error occurred while retrieving registrations."
                };
            }
        }
    }
}
