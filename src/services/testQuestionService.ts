const API_BASE_URL = 'http://localhost:5002/api';

export interface TestQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  explanation?: string;
  testType: 'IT' | 'Cybersecurity';
}

export interface CreateQuestionRequest {
  question: string;
  options: string[];
  correctAnswer: number;
  category?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  explanation?: string;
  testType: 'IT' | 'Cybersecurity';
}

export interface UpdateQuestionRequest extends CreateQuestionRequest {
  id: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

class TestQuestionService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async getQuestions(testType: 'IT' | 'Cybersecurity'): Promise<ApiResponse<TestQuestion[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/test-questions?testType=${testType}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await response.json();
    } catch (error) {
      console.error('Get questions error:', error);
      return {
        success: false,
        message: 'Network error occurred while fetching questions',
      };
    }
  }

  async createQuestion(questionData: CreateQuestionRequest): Promise<ApiResponse<TestQuestion>> {
    try {
      const response = await fetch(`${API_BASE_URL}/test-questions`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(questionData),
      });

      return await response.json();
    } catch (error) {
      console.error('Create question error:', error);
      return {
        success: false,
        message: 'Network error occurred while creating question',
      };
    }
  }

  async updateQuestion(questionData: UpdateQuestionRequest): Promise<ApiResponse<TestQuestion>> {
    try {
      const response = await fetch(`${API_BASE_URL}/test-questions/${questionData.id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(questionData),
      });

      return await response.json();
    } catch (error) {
      console.error('Update question error:', error);
      return {
        success: false,
        message: 'Network error occurred while updating question',
      };
    }
  }

  async deleteQuestion(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/test-questions/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      return await response.json();
    } catch (error) {
      console.error('Delete question error:', error);
      return {
        success: false,
        message: 'Network error occurred while deleting question',
      };
    }
  }

  async bulkImportQuestions(questions: CreateQuestionRequest[]): Promise<ApiResponse<TestQuestion[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/test-questions/bulk`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ questions }),
      });

      return await response.json();
    } catch (error) {
      console.error('Bulk import questions error:', error);
      return {
        success: false,
        message: 'Network error occurred while importing questions',
      };
    }
  }

  async exportQuestions(testType: 'IT' | 'Cybersecurity'): Promise<ApiResponse<TestQuestion[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/test-questions/export?testType=${testType}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await response.json();
    } catch (error) {
      console.error('Export questions error:', error);
      return {
        success: false,
        message: 'Network error occurred while exporting questions',
      };
    }
  }
}

export const testQuestionService = new TestQuestionService();
