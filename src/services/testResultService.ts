import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

export interface TestResultSubmissionRequest {
  email: string;
  name: string;
  score: number;
  totalQuestions: number;
  timeTaken: number; // in seconds
  testType?: string;
}

export interface TestResultResponse {
  id: string;
  email: string;
  name: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number;
  testType: string;
  submittedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

class TestResultService {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async submitTestResult(request: TestResultSubmissionRequest): Promise<ApiResponse<TestResultResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/testresult/submit`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          ...request,
          testType: request.testType || 'IT'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Test result submission failed',
          errors: data.errors || []
        };
      }

      return data;
    } catch (error) {
      console.error('Test result submission error:', error);
      return {
        success: false,
        message: 'Network error occurred. Please try again.',
        errors: []
      };
    }
  }

  async getTestResultsByEmail(email: string): Promise<ApiResponse<TestResultResponse[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/testresult/by-email/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to fetch test results',
          errors: data.errors || []
        };
      }

      return data;
    } catch (error) {
      console.error('Get test results error:', error);
      return {
        success: false,
        message: 'Network error occurred. Please try again.',
        errors: []
      };
    }
  }

  async getTestResultById(id: string): Promise<ApiResponse<TestResultResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/testresult/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to fetch test result',
          errors: data.errors || []
        };
      }

      return data;
    } catch (error) {
      console.error('Get test result error:', error);
      return {
        success: false,
        message: 'Network error occurred. Please try again.',
        errors: []
      };
    }
  }
}

export const testResultService = new TestResultService();
