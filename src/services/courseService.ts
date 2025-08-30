const API_BASE_URL = 'http://localhost:5002/api';

export interface Course {
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

export interface VideoLesson {
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

export interface CreateCourseRequest {
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
}

export interface CreateVideoRequest {
  videoId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
  courseId: string;
}

export interface CourseRegistrationRequest {
  studentName: string;
  email: string;
  phone: string;
  courseName: string;
  experience: string;
  notes: string;
}

export interface CourseRegistration {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  courseName: string;
  experience: string;
  notes: string;
  registrationDate: string;
  status: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

class CourseService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Course methods
  async getAllCourses(): Promise<ApiResponse<Course[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/course`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await response.json();
    } catch (error) {
      console.error('Get courses error:', error);
      return {
        success: false,
        message: 'Network error occurred while fetching courses',
      };
    }
  }

  async getCourseById(id: string): Promise<ApiResponse<Course>> {
    try {
      const response = await fetch(`${API_BASE_URL}/course/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await response.json();
    } catch (error) {
      console.error('Get course error:', error);
      return {
        success: false,
        message: 'Network error occurred while fetching course',
      };
    }
  }

  async createCourse(courseData: CreateCourseRequest): Promise<ApiResponse<Course>> {
    try {
      const response = await fetch(`${API_BASE_URL}/course`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(courseData),
      });

      return await response.json();
    } catch (error) {
      console.error('Create course error:', error);
      return {
        success: false,
        message: 'Network error occurred while creating course',
      };
    }
  }

  async updateCourse(id: string, courseData: Partial<CreateCourseRequest>): Promise<ApiResponse<Course>> {
    try {
      const response = await fetch(`${API_BASE_URL}/course/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(courseData),
      });

      return await response.json();
    } catch (error) {
      console.error('Update course error:', error);
      return {
        success: false,
        message: 'Network error occurred while updating course',
      };
    }
  }

  async deleteCourse(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/course/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      return await response.json();
    } catch (error) {
      console.error('Delete course error:', error);
      return {
        success: false,
        message: 'Network error occurred while deleting course',
      };
    }
  }

  // Video methods
  async getAllVideos(): Promise<ApiResponse<VideoLesson[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/video`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await response.json();
    } catch (error) {
      console.error('Get videos error:', error);
      return {
        success: false,
        message: 'Network error occurred while fetching videos',
      };
    }
  }

  async getVideosByCourse(courseId: string): Promise<ApiResponse<VideoLesson[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/video/course/${courseId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await response.json();
    } catch (error) {
      console.error('Get course videos error:', error);
      return {
        success: false,
        message: 'Network error occurred while fetching course videos',
      };
    }
  }

  async createVideo(videoData: CreateVideoRequest): Promise<ApiResponse<VideoLesson>> {
    try {
      const response = await fetch(`${API_BASE_URL}/video`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(videoData),
      });

      return await response.json();
    } catch (error) {
      console.error('Create video error:', error);
      return {
        success: false,
        message: 'Network error occurred while creating video',
      };
    }
  }

  async updateVideo(id: string, videoData: Partial<CreateVideoRequest>): Promise<ApiResponse<VideoLesson>> {
    try {
      const response = await fetch(`${API_BASE_URL}/video/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(videoData),
      });

      return await response.json();
    } catch (error) {
      console.error('Update video error:', error);
      return {
        success: false,
        message: 'Network error occurred while updating video',
      };
    }
  }

  async deleteVideo(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/video/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      return await response.json();
    } catch (error) {
      console.error('Delete video error:', error);
      return {
        success: false,
        message: 'Network error occurred while deleting video',
      };
    }
  }

  // Course registration methods
  async registerForCourse(registrationData: CourseRegistrationRequest): Promise<ApiResponse<CourseRegistration>> {
    try {
      const response = await fetch(`${API_BASE_URL}/course/register`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(registrationData),
      });

      return await response.json();
    } catch (error) {
      console.error('Course registration error:', error);
      return {
        success: false,
        message: 'Network error occurred while registering for course',
      };
    }
  }
}

export const courseService = new CourseService();
