// API Configuration
const getApiBaseUrl = (): string => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Fallback to localhost for development
  if (import.meta.env.DEV) {
    return 'http://localhost:5002/api';
  }
  
  // Production fallback - you should set VITE_API_BASE_URL in production
  return 'https://your-backend-api.vercel.app/api';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    VALIDATE: '/auth/validate',
  },
  
  // Course endpoints
  COURSES: {
    BASE: '/courses',
    BY_ID: (id: string) => `/courses/${id}`,
    REGISTER: '/courses/register',
  },
  
  // Video endpoints
  VIDEOS: {
    BASE: '/videos',
    BY_ID: (id: string) => `/videos/${id}`,
    BY_COURSE: (courseId: string) => `/videos/course/${courseId}`,
  },
  
  // Test result endpoints
  TEST_RESULTS: {
    SUBMIT: '/testresult/submit',
    BY_EMAIL: (email: string) => `/testresult/by-email/${encodeURIComponent(email)}`,
    BY_ID: (id: string) => `/testresult/${id}`,
  },
} as const;
