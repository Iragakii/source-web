import { API_BASE_URL } from '../config/api';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    success: boolean;
    message: string;
    token?: string;
    user?: {
      id: string;
      username: string;
      email: string;
      role: string;
      createdAt: string;
    };
  };
  errors?: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

class AuthService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      
      if (result.success && result.data?.token) {
        localStorage.setItem('authToken', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Network error occurred during registration',
      };
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();
      
      if (result.success && result.data?.token) {
        localStorage.setItem('authToken', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error occurred during login',
      };
    }
  }

  async logout(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      
      // Clear local storage regardless of API response
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      return result.success;
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local storage even if API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return false;
    }
  }

  async getProfile(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: 'Network error occurred while fetching profile',
      };
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

export const authService = new AuthService();
