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
  courseName: string;
  createdAt: string;
}

const VideoManagement: React.FC = () => {
  const [videos, setVideos] = useState<VideoLesson[]>([]);
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
  });

  // Mock data for development - replace with API calls
  const mockVideos: VideoLesson[] = [
    {
      id: "1",
      videoId: "NET01-L01",
      title: "Introduction to Networking",
      description: "Basic concepts of computer networking and protocols.",
      videoUrl: "https://example.com/video1.mp4",
      duration: "15:30",
      order: 1,
      isActive: true,
      courseId: "course-it-01",
      courseName: "Networking Essentials and Security",
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      videoId: "NET01-L02",
      title: "OSI Model Deep Dive",
      description: "Understanding the seven layers of the OSI model.",
      videoUrl: "https://example.com/video2.mp4",
      duration: "22:45",
      order: 2,
      isActive: true,
      courseId: "course-it-01",
      courseName: "Networking Essentials and Security",
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "3",
      videoId: "FOR03-L01",
      title: "Digital Evidence Collection",
      description: "Proper procedures for collecting digital evidence.",
      videoUrl: "https://example.com/video3.mp4",
      duration: "28:15",
      order: 1,
      isActive: true,
      courseId: "course-cyber-03",
      courseName: "Digital Forensics & Incident Response",
      createdAt: "2024-01-02T00:00:00Z"
    }
  ];

  const mockCourses = [
    { id: "course-it-01", name: "Networking Essentials and Security" },
    { id: "course-cyber-03", name: "Digital Forensics & Incident Response" }
  ];

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await videoService.getAllVideos();
      setVideos(mockVideos);
    } catch (error) {
      showNotification("Failed to load videos", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedCourse = mockCourses.find(c => c.id === formData.courseId);
      
      if (editingVideo) {
        // Update video
        const updatedVideo = { 
          ...editingVideo, 
          ...formData,
          courseName: selectedCourse?.name || ""
        };
        setVideos(videos.map(v => v.id === editingVideo.id ? updatedVideo : v));
        showNotification("Video updated successfully!", "success");
      } else {
        // Create new video
        const newVideo: VideoLesson = {
          id: Date.now().toString(),
          ...formData,
          courseName: selectedCourse?.name || "",
          isActive: true,
          createdAt: new Date().toISOString()
        };
        setVideos([...videos, newVideo]);
        showNotification("Video created successfully!", "success");
      }
      resetForm();
    } catch (error) {
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
    });
    setShowModal(true);
  };

  const handleDelete = async (videoId: string) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        setVideos(videos.filter(v => v.id !== videoId));
        showNotification("Video deleted successfully!", "success");
      } catch (error) {
        showNotification("Failed to delete video", "error");
      }
    }
  };

  const handleToggleActive = async (videoId: string) => {
    try {
      setVideos(videos.map(v => 
        v.id === videoId ? { ...v, isActive: !v.isActive } : v
      ));
      showNotification("Video status updated!", "success");
    } catch (error) {
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
    });
    setEditingVideo(null);
    setShowModal(false);
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.videoId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === "all" || video.courseId === filterCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-mono text-[#61b3dc] font-bold">[ VIDEO MANAGEMENT ]</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#61b3dc] text-black font-mono py-2 px-6 rounded hover:bg-[#4A9BC4] transition-all duration-300 cursor-pointer transform hover:scale-105"
        >
          [ + ADD VIDEO ]
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-black/50 border border-[#2b4539] rounded-lg p-4">
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
            {mockCourses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
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
        <div className="space-y-4">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className={`bg-black/50 border rounded-lg p-4 transition-all duration-300 ${
                video.isActive ? 'border-[#2b4539] hover:border-[#61b3dc]' : 'border-red-500/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-[#61b3dc] font-mono font-bold">{video.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-mono ${
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
                    <span className="text-[#2b4539] font-mono">Course: {video.courseName}</span>
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
                    className={`font-mono py-1 px-3 rounded text-xs transition-all duration-300 ${
                      video.isActive
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {video.isActive ? 'DISABLE' : 'ENABLE'}
                  </button>
                  
                  <button
                    onClick={() => handleEdit(video)}
                    className="bg-[#61b3dc] text-black font-mono py-1 px-3 rounded text-xs hover:bg-[#4A9BC4] transition-all duration-300"
                  >
                    EDIT
                  </button>
                  
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="bg-red-600 text-white font-mono py-1 px-3 rounded text-xs hover:bg-red-700 transition-all duration-300"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
                    {mockCourses.map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
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
