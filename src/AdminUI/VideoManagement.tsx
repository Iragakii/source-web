import React, { useState, useEffect } from "react";
import { useNotification } from "../contexts/NotificationContext";

interface VideoLesson {
  id: string;
  videoId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
  isActive: boolean;
  courseId: string;
  courseName?: string;
  createdAt: string;
}

interface Course {
  id: string;
  courseId: string;
  title: string;
  category: string;
}

const VideoManagement: React.FC = () => {
  const [videos, setVideos] = useState<VideoLesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoLesson | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    videoId: "",
    title: "",
    description: "",
    videoUrl: "",
    duration: "",
    order: 1,
    courseId: "",
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadVideos(), loadCourses()]);
  };

  const loadVideos = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5002/api/videos', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setVideos(result.data);
        }
      } else {
        showNotification("Failed to load videos", "error");
      }
    } catch (error) {
      console.error("Error loading videos:", error);
      showNotification("Failed to load videos", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
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
          const courseList = result.data.map((course: any) => ({
            id: course.id,
            courseId: course.courseId,
            title: course.title,
            category: course.category
          }));
          setCourses(courseList);
        }
      }
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      
      if (editingVideo) {
        // Update video - ensure we're sending the correct data structure
        const response = await fetch(`http://localhost:5002/api/videos/${editingVideo.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            showNotification("Video updated successfully!", "success");
            loadVideos(); // Reload videos
          } else {
            showNotification(`Failed to update video: ${result.message}`, "error");
          }
        } else {
          const errorData = await response.json();
          showNotification(`Failed to update video: ${errorData.message || 'Unknown error'}`, "error");
        }
      } else {
        // Create new video
        const response = await fetch('http://localhost:5002/api/videos', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            showNotification("Video created successfully!", "success");
            loadVideos(); // Reload videos
          } else {
            showNotification(`Failed to create video: ${result.message}`, "error");
          }
        } else {
          const errorData = await response.json();
          showNotification(`Failed to create video: ${errorData.message || 'Unknown error'}`, "error");
        }
      }
      resetForm();
    } catch (error) {
      console.error("Error saving video:", error);
      showNotification("Failed to save video", "error");
    }
  };

  const handleEdit = (video: VideoLesson) => {
    setEditingVideo(video);
    setFormData({
      videoId: video.videoId,
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      duration: video.duration,
      order: video.order,
      courseId: video.courseId,
      isActive: video.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (videoId: string) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:5002/api/videos/${videoId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // Update local state immediately
            setVideos(prevVideos => prevVideos.filter(v => v.id !== videoId));
            showNotification("Video deleted successfully!", "success");
          } else {
            showNotification(`Failed to delete video: ${result.message}`, "error");
          }
        } else {
          const errorData = await response.json();
          showNotification(`Failed to delete video: ${errorData.message || 'Unknown error'}`, "error");
        }
      } catch (error) {
        console.error("Error deleting video:", error);
        showNotification("Failed to delete video", "error");
      }
    }
  };

  const handleToggleActive = async (videoId: string) => {
    try {
      const video = videos.find(v => v.id === videoId);
      if (!video) return;

      const token = localStorage.getItem('authToken');
      
      // Create proper update request matching backend DTO with toggled isActive
      const updateRequest = {
        videoId: video.videoId,
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        duration: video.duration,
        order: video.order,
        courseId: video.courseId,
        isActive: !video.isActive  // Toggle the active status
      };

      const response = await fetch(`http://localhost:5002/api/videos/${videoId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateRequest)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Update local state immediately for better UX
          setVideos(prevVideos => 
            prevVideos.map(v => 
              v.id === videoId ? { ...v, isActive: !v.isActive } : v
            )
          );
          showNotification(`Video ${!video.isActive ? 'enabled' : 'disabled'} successfully!`, "success");
        } else {
          showNotification(`Failed to update video status: ${result.message}`, "error");
        }
      } else {
        const errorData = await response.json();
        showNotification(`Failed to update video status: ${errorData.message || 'Unknown error'}`, "error");
      }
    } catch (error) {
      console.error("Error updating video status:", error);
      showNotification("Failed to update video status", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      videoId: "",
      title: "",
      description: "",
      videoUrl: "",
      duration: "",
      order: 1,
      courseId: "",
      isActive: true,
    });
    setEditingVideo(null);
    setShowModal(false);
  };

  const getCourseName = (courseId: string) => {
    const course = courses.find(c => c.courseId === courseId);
    return course ? course.title : courseId;
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.videoId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === "all" || video.courseId === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const itVideos = filteredVideos.filter(v => {
    const course = courses.find(c => c.courseId === v.courseId);
    return course?.category === "IT";
  });

  const cyberVideos = filteredVideos.filter(v => {
    const course = courses.find(c => c.courseId === v.courseId);
    return course?.category === "Cyber";
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-mono rounded-sm text-black bg-[#61dca3] font-medium">[ VIDEO MANAGEMENT ]</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#61b3dc] text-black font-mono py-2 px-6 rounded hover:bg-[#4A9BC4] transition-all duration-300 cursor-pointer transform hover:scale-105"
        >
          [ + ADD VIDEO ]
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black/50 border border-[#2b4539] rounded-lg p-4 text-center">
          <div className="text-2xl font-mono text-[#61b3dc] font-bold">{videos.length}</div>
          <div className=" text-sm font-mono text-[#93FFD8]">Total Videos</div>
        </div>
        <div className="bg-black/50 border border-[#2b4539] rounded-lg p-4 text-center">
          <div className="text-2xl font-mono text-[#61dca3] font-bold">{itVideos.length}</div>
          <div className="text-sm font-mono text-[#34BE82]">IT Videos</div>
        </div>
        <div className="bg-black/50 border border-[#2b4539] rounded-lg p-4 text-center">
          <div className="text-2xl font-mono text-[#61b3dc] font-bold">{cyberVideos.length}</div>
          <div className="text-sm font-mono text-[#80ED99]">Cyber Videos</div>
        </div>
      </div>

      {/* Filters */}
      <div className="!mb-8 flex flex-col sm:flex-row gap-4 bg-black/90  rounded-lg !p-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border border-[#2b4539] rounded px-4 py-2 text-[#61b3dc] font-mono focus:border-[#61b3dc] focus:outline-none"
          />
        </div>
        <div>
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="bg-black border border-[#2b4539] rounded px-4 py-2 text-[#61b3dc] font-mono focus:border-[#61b3dc] focus:outline-none"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course.courseId} value={course.courseId}>
                {course.title} ({course.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Video List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-[#61b3dc] font-mono">Loading videos...</div>
        </div>
      ) : (
        <>
          {/* Cyber Videos Section */}
          {cyberVideos.length > 0 && (
            <div className="space-y-4 !mb-5">
              <h3 className="text-xl font-mono bg-black/90 w-79 !mb-2  text-[#93FFD8] font-bold">[ CYBERSECURITY VIDEOS - {cyberVideos.length} ]</h3>
              <div className="space-y-4">
                {cyberVideos.map((video) => (
                  <div
                    key={video.id}
                    className={`bg-black/50 border rounded-lg p-4 transition-all duration-300 ${
                      video.isActive ? 'border-[#2b4539] hover:border-[#61b3dc]' : 'border-red-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-4">
                          <h4 className="text-[#61b3dc] font-mono font-bold">{video.title}</h4>
                          <span className={` !ml-3 !px-2 py-1 rounded text-xs font-mono ${
                            video.isActive 
                              ? 'bg-green-600 text-white' 
                              : 'bg-red-600 text-white'
                          }`}>
                            {video.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                        
                        <p className="text-[#61dca3] font-mono text-sm">{video.videoId}</p>
                        <p className="text-gray-400 text-sm">{video.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm">
                          <span className="text-[#2b4539] font-mono">Course: {getCourseName(video.courseId)}</span>
                          <span className="text-[#2b4539] font-mono">Duration: {video.duration}</span>
                          <span className="text-[#2b4539] font-mono">Order: #{video.order}</span>
                        </div>
                        
                        <div className="text-xs text-gray-500 font-mono">
                          Created: {new Date(video.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleToggleActive(video.id)}
                          className={`font-mono py-1 !px-3 rounded text-xs transition-all duration-300 ${
                            video.isActive
                              ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {video.isActive ? 'DISABLE' : 'ENABLE'}
                        </button>
                        
                        <button
                          onClick={() => handleEdit(video)}
                          className="bg-[#61b3dc] text-black font-mono py-1 !px-3 rounded text-xs hover:bg-[#4A9BC4] transition-all duration-300"
                        >
                          EDIT
                        </button>
                        
                        <button
                          onClick={() => handleDelete(video.id)}
                          className="bg-red-600 text-white font-mono py-1 !px-3 rounded text-xs hover:bg-red-700 transition-all duration-300"
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
          {/* IT Videos Section */}
          {itVideos.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-mono bg-[#61dca3] w-48 !mb-3 text-black font-bold">[ IT VIDEOS - {itVideos.length} ]</h3>
              <div className="space-y-4">
                {itVideos.map((video) => (
                  <div
                    key={video.id}
                    className={`bg-black/50 border rounded-lg p-4 transition-all duration-300 ${
                      video.isActive ? 'border-[#2b4539] hover:border-[#61b3dc]' : 'border-red-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-4">
                          <h4 className="text-[#61b3dc] font-mono font-bold">{video.title}</h4>
                          <span className={`!ml-3 !px-2 py-1 rounded text-xs font-mono ${
                            video.isActive 
                              ? 'bg-green-600 text-white' 
                              : 'bg-red-600 text-white'
                          }`}>
                            {video.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                        
                        <p className="text-[#61dca3] font-mono text-sm">{video.videoId}</p>
                        <p className="text-gray-400 text-sm">{video.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm">
                          <span className="text-[#2b4539] font-mono">Course: {getCourseName(video.courseId)}</span>
                          <span className="text-[#2b4539] font-mono">Duration: {video.duration}</span>
                          <span className="text-[#2b4539] font-mono">Order: #{video.order}</span>
                        </div>
                        
                        <div className="text-xs text-gray-500 font-mono">
                          Created: {new Date(video.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleToggleActive(video.id)}
                          className={`font-mono py-1 !px-3 rounded text-xs transition-all duration-300 ${
                            video.isActive
                              ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {video.isActive ? 'DISABLE' : 'ENABLE'}
                        </button>
                        
                        <button
                          onClick={() => handleEdit(video)}
                          className="bg-[#61b3dc] text-black font-mono py-1 !px-3 rounded text-xs hover:bg-[#4A9BC4] transition-all duration-300"
                        >
                          EDIT
                        </button>
                        
                        <button
                          onClick={() => handleDelete(video.id)}
                          className="bg-red-600 text-white font-mono py-1 !px-3 rounded text-xs hover:bg-red-700 transition-all duration-300"
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

         

          {/* No videos found */}
          {filteredVideos.length === 0 && (
            <div className="text-center py-8">
              <div className="text-[#61b3dc] font-mono">No videos found matching your criteria.</div>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-black border-2 border-[#61b3dc] rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-[#61b3dc] font-mono text-xl mb-6">
              {editingVideo ? "[ EDIT VIDEO ]" : "[ ADD NEW VIDEO ]"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#61b3dc] font-mono text-sm mb-2">Video ID:</label>
                  <input
                    type="text"
                    value={formData.videoId}
                    onChange={(e) => setFormData({...formData, videoId: e.target.value})}
                    className="w-full bg-transparent border border-[#2b4539] rounded px-3 py-2 text-[#61b3dc] font-mono focus:border-[#61b3dc] focus:outline-none"
                    placeholder="e.g., NET01-L01"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-[#61b3dc] font-mono text-sm mb-2">Course:</label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                    className="w-full bg-black border border-[#2b4539] rounded px-3 py-2 text-[#61b3dc] font-mono focus:border-[#61b3dc] focus:outline-none"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.courseId} value={course.courseId}>
                        {course.title} ({course.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#61b3dc] font-mono text-sm mb-2">Title:</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-transparent border border-[#2b4539] rounded px-3 py-2 text-[#61b3dc] font-mono focus:border-[#61b3dc] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#61b3dc] font-mono text-sm mb-2">Description:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-transparent border border-[#2b4539] rounded px-3 py-2 text-[#61b3dc] font-mono focus:border-[#61b3dc] focus:outline-none h-20"
                  required
                />
              </div>

              <div>
                <label className="block text-[#61b3dc] font-mono text-sm mb-2">Video URL:</label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                  className="w-full bg-transparent border border-[#2b4539] rounded px-3 py-2 text-[#61b3dc] font-mono focus:border-[#61b3dc] focus:outline-none"
                  placeholder="https://example.com/video.mp4"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#61b3dc] font-mono text-sm mb-2">Duration:</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full bg-transparent border border-[#2b4539] rounded px-3 py-2 text-[#61b3dc] font-mono focus:border-[#61b3dc] focus:outline-none"
                    placeholder="e.g., 15:30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#61b3dc] font-mono text-sm mb-2">Order:</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    className="w-full bg-transparent border border-[#2b4539] rounded px-3 py-2 text-[#61b3dc] font-mono focus:border-[#61b3dc] focus:outline-none"
                    min="1"
                    required
                  />
                </div>
              </div>

              {editingVideo && (
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="rounded border-[#2b4539] bg-transparent text-[#61b3dc] focus:ring-[#61b3dc]"
                    />
                    <span className="text-[#61b3dc] font-mono text-sm">Video is Active</span>
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-transparent border-2 border-[#61dca3] text-[#61dca3] font-mono py-2 px-6 rounded hover:bg-[#61dca3] hover:text-black transition-all duration-300"
                >
                  [ CANCEL ]
                </button>
                <button
                  type="submit"
                  className="bg-[#61b3dc] text-black font-mono py-2 px-6 rounded hover:bg-[#4A9BC4] transition-all duration-300"
                >
                  [ {editingVideo ? "UPDATE" : "CREATE"} ]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoManagement;
