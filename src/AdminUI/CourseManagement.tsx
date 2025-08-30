import React, { useState, useEffect } from "react";
import { useNotification } from "../contexts/NotificationContext";

interface Course {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  instructor: string;
  imageUrl: string;
  category: string;
  videoId: string;
  isVideo: boolean;
  isActive: boolean;
  createdAt: string;
}

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    description: "",
    duration: "",
    level: "Beginner",
    instructor: "",
    imageUrl: "",
    category: "IT",
    videoId: "",
    isVideo: true,
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5002/api/courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          // Transform backend data to frontend format
          const transformedCourses = result.data.map((course: any) => ({
            id: course.id,
            courseId: course.courseId,
            title: course.title,
            description: course.description,
            duration: course.duration,
            level: course.level,
            instructor: course.instructor,
            imageUrl: course.imageUrl,
            category: course.category,
            videoId: course.videoId,
            isVideo: course.isVideo,
            isActive: course.isActive,
            createdAt: course.createdAt
          }));
          setCourses(transformedCourses);
        }
      } else {
        showNotification("Failed to load courses", "error");
      }
    } catch (error) {
      console.error("Error loading courses:", error);
      showNotification("Failed to load courses", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      
      if (editingCourse) {
        // Update course
        const response = await fetch(`http://localhost:5002/api/courses/${editingCourse.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          showNotification("Course updated successfully!", "success");
          loadCourses(); // Reload courses
        } else {
          showNotification("Failed to update course", "error");
        }
      } else {
        // Create new course
        const response = await fetch('http://localhost:5002/api/courses', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          showNotification("Course created successfully!", "success");
          loadCourses(); // Reload courses
        } else {
          showNotification("Failed to create course", "error");
        }
      }
      resetForm();
    } catch (error) {
      console.error("Error saving course:", error);
      showNotification("Failed to save course", "error");
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      courseId: course.courseId,
      title: course.title,
      description: course.description,
      duration: course.duration,
      level: course.level,
      instructor: course.instructor,
      imageUrl: course.imageUrl,
      category: course.category,
      videoId: course.videoId,
      isVideo: course.isVideo,
    });
    setShowModal(true);
  };

  const handleDelete = async (courseId: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:5002/api/courses/${courseId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          showNotification("Course deleted successfully!", "success");
          loadCourses(); // Reload courses
        } else {
          showNotification("Failed to delete course", "error");
        }
      } catch (error) {
        console.error("Error deleting course:", error);
        showNotification("Failed to delete course", "error");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      courseId: "",
      title: "",
      description: "",
      duration: "",
      level: "Beginner",
      instructor: "",
      imageUrl: "",
      category: "IT",
      videoId: "",
      isVideo: true,
    });
    setEditingCourse(null);
    setShowModal(false);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const itCourses = filteredCourses.filter(c => c.category === "IT");
  const cyberCourses = filteredCourses.filter(c => c.category === "Cyber");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-mono text-[#61dca3] font-bold">[ COURSE MANAGEMENT ]</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#61dca3] text-black font-mono py-2 px-6 rounded hover:bg-[#7BC47F] transition-all duration-300 cursor-pointer transform hover:scale-105"
        >
          [ + ADD COURSE ]
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black/50 border border-[#2b4539] rounded-lg p-4 text-center">
          <div className="text-2xl font-mono text-[#61dca3] font-bold">{courses.length}</div>
          <div className="text-sm font-mono text-[#2b4539]">Total Courses</div>
        </div>
        <div className="bg-black/50 border border-[#2b4539] rounded-lg p-4 text-center">
          <div className="text-2xl font-mono text-[#61b3dc] font-bold">{itCourses.length}</div>
          <div className="text-sm font-mono text-[#2b4539]">IT Courses</div>
        </div>
        <div className="bg-black/50 border border-[#2b4539] rounded-lg p-4 text-center">
          <div className="text-2xl font-mono text-[#61dca3] font-bold">{cyberCourses.length}</div>
          <div className="text-sm font-mono text-[#2b4539]">Cyber Courses</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-black/50 border border-[#2b4539] rounded-lg p-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border border-[#2b4539] rounded px-4 py-2 text-[#61dca3] font-mono focus:border-[#61dca3] focus:outline-none"
          />
        </div>
        <div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-black border border-[#2b4539] rounded px-4 py-2 text-[#61dca3] font-mono focus:border-[#61dca3] focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="IT">IT ({itCourses.length})</option>
            <option value="Cyber">Cybersecurity ({cyberCourses.length})</option>
          </select>
        </div>
      </div>

      {/* Course List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-[#61dca3] font-mono">Loading courses...</div>
        </div>
      ) : (
        <>
          {/* IT Courses Section */}
          {(filterCategory === "all" || filterCategory === "IT") && itCourses.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-mono text-[#61b3dc] font-bold">[ IT COURSES - {itCourses.length} ]</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-black/50 border border-[#2b4539] rounded-lg p-4 hover:border-[#61dca3] transition-all duration-300"
                  >
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-32 object-cover rounded mb-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Course+Image';
                      }}
                    />
                    <div className="space-y-2">
                      <h4 className="text-[#61dca3] font-mono font-bold text-sm">{course.title}</h4>
                      <p className="text-[#61b3dc] font-mono text-xs">{course.courseId}</p>
                      <p className="text-gray-400 text-xs line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#2b4539] font-mono">{course.category}</span>
                        <span className="text-[#2b4539] font-mono">{course.level}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#61b3dc] font-mono">{course.instructor}</span>
                        <span className="text-[#61b3dc] font-mono">{course.duration}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="bg-[#61b3dc] text-black font-mono py-1 px-3 rounded text-xs hover:bg-[#4A9BC4] transition-all duration-300"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="bg-red-600 text-white font-mono py-1 px-3 rounded text-xs hover:bg-red-700 transition-all duration-300"
                        >
                          DELETE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cyber Courses Section */}
          {(filterCategory === "all" || filterCategory === "Cyber") && cyberCourses.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-mono text-[#61dca3] font-bold">[ CYBERSECURITY COURSES - {cyberCourses.length} ]</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cyberCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-black/50 border border-[#2b4539] rounded-lg p-4 hover:border-[#61dca3] transition-all duration-300"
                  >
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-32 object-cover rounded mb-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Course+Image';
                      }}
                    />
                    <div className="space-y-2">
                      <h4 className="text-[#61dca3] font-mono font-bold text-sm">{course.title}</h4>
                      <p className="text-[#61b3dc] font-mono text-xs">{course.courseId}</p>
                      <p className="text-gray-400 text-xs line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#2b4539] font-mono">{course.category}</span>
                        <span className="text-[#2b4539] font-mono">{course.level}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#61b3dc] font-mono">{course.instructor}</span>
                        <span className="text-[#61b3dc] font-mono">{course.duration}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="bg-[#61b3dc] text-black font-mono py-1 px-3 rounded text-xs hover:bg-[#4A9BC4] transition-all duration-300"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="bg-red-600 text-white font-mono py-1 px-3 rounded text-xs hover:bg-red-700 transition-all duration-300"
                        >
                          DELETE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No courses found */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-8">
              <div className="text-[#61dca3] font-mono">No courses found matching your criteria.</div>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-black border-2 border-[#61dca3] rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-[#61dca3] font-mono text-xl mb-6">
              {editingCourse ? "[ EDIT COURSE ]" : "[ ADD NEW COURSE ]"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#61dca3] font-mono text-sm mb-2">Course ID:</label>
                  <input
                    type="text"
                    value={formData.courseId}
                    onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                    className="w-full bg-transparent border border-[#2b4539] rounded px-3 py-2 text-[#61dca3] font-mono focus:border-[#61dca3] focus:outline-none"
                    placeholder="e.g., course-it-01"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-[#61dca3] font-mono text-sm mb-2">Video ID:</label>
                  <input
                    type="text"
                    value={formData.videoId}
                    onChange={(e) => setFormData({...formData, videoId: e.target.value})}
                    className="w-full bg-transparent border border-[#2b4539] rounded px-3 py-2 text-[#61dca3] font-mono focus:border-[#61dca3] focus:outline-none"
                    placeholder="e.g., NET01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#61dca3] font-mono text-sm mb-2">Title:</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-transparent border border-[#2b4539] rounded px-3 py-2 text-[#61dca3] font-mono focus:border-[#61dca3] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#61dca3] font-mono text-sm mb-2">Description:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-transparent border border-[#2b4539] rounded px-3 py-2 text-[#61dca3] font-mono focus:border-[#61dca3] focus:outline-none h-20"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#61dca3] font-mono text-sm mb-2">Duration:</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full bg-transparent border border-[#2b4539] rounded px-3 py-2 text-[#61dca3] font-mono focus:border-[#61dca3] focus:outline-none"
                    placeholder="e.g., 8 weeks"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#61dca3] font-mono text-sm mb-2">Level:</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    className="w-full bg-black border border-[#2b4539] rounded px-3 py-2 text-[#61dca3] font-mono focus:border-[#61dca3] focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#61dca3] font-mono text-sm mb-2">Category:</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-black border border-[#2b4539] rounded px-3 py-2 text-[#61dca3] font-mono focus:border-[#61dca3] focus:outline-none"
                  >
                    <option value="IT">IT</option>
                    <option value="Cyber">Cybersecurity</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#61dca3] font-mono text-sm mb-2">Instructor:</label>
                <input
                  type="text"
                  value={formData.instructor}
                  onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                  className="w-full bg-transparent border border-[#2b4539] rounded px-3 py-2 text-[#61dca3] font-mono focus:border-[#61dca3] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#61dca3] font-mono text-sm mb-2">Image URL:</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full bg-transparent border border-[#2b4539] rounded px-3 py-2 text-[#61dca3] font-mono focus:border-[#61dca3] focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isVideo}
                    onChange={(e) => setFormData({...formData, isVideo: e.target.checked})}
                    className="form-checkbox text-[#61dca3]"
                  />
                  <span className="text-[#61dca3] font-mono text-sm">Is Video Course</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-transparent border-2 border-[#61b3dc] text-[#61b3dc] font-mono py-2 px-6 rounded hover:bg-[#61b3dc] hover:text-black transition-all duration-300"
                >
                  [ CANCEL ]
                </button>
                <button
                  type="submit"
                  className="bg-[#61dca3] text-black font-mono py-2 px-6 rounded hover:bg-[#7BC47F] transition-all duration-300"
                >
                  [ {editingCourse ? "UPDATE" : "CREATE"} ]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
