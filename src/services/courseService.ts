const API_BASE_URL = 'http://localhost:5002/api';

export interface CourseRegistrationRequest {
  studentName: string;
  email: string;
  phone: string;
  courseName: string;
  experience: string;
  notes?: string;
}

export interface CourseRegistrationResponse {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  courseName: string;
  experience: string;
  status: string;
  registrationDate: string;
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

class CourseService {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async registerForCourse(request: CourseRegistrationRequest): Promise<ApiResponse<CourseRegistrationResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/course/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Registration failed',
          errors: data.errors || []
        };
      }

      return data;
    } catch (error) {
      console.error('Course registration error:', error);
      return {
        success: false,
        message: 'Network error occurred. Please try again.',
        errors: []
      };
    }
  }

  async getAvailableCourses(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/course/available`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to fetch courses',
          errors: data.errors || []
        };
      }

      return data;
    } catch (error) {
      console.error('Get courses error:', error);
      return {
        success: false,
        message: 'Network error occurred. Please try again.',
        errors: []
      };
    }
  }

  async getMyRegistrations(): Promise<ApiResponse<CourseRegistrationResponse[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/course/my-registrations`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to fetch registrations',
          errors: data.errors || []
        };
      }

      return data;
    } catch (error) {
      console.error('Get registrations error:', error);
      return {
        success: false,
        message: 'Network error occurred. Please try again.',
        errors: []
      };
    }
  }

  async getRegistrationById(registrationId: string): Promise<ApiResponse<CourseRegistrationResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/course/registration/${registrationId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to fetch registration',
          errors: data.errors || []
        };
      }

      return data;
    } catch (error) {
      console.error('Get registration error:', error);
      return {
        success: false,
        message: 'Network error occurred. Please try again.',
        errors: []
      };
    }
  }
}

export const courseService = new CourseService();
