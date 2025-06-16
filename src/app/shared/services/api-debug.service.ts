import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiDebugService {

  constructor() { }

  // Check authentication status
  checkAuthStatus(): {isAuthenticated: boolean, token: string | null, user: any} {
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      return {
        isAuthenticated: false,
        token: null,
        user: null
      };
    }

    try {
      const user = JSON.parse(userData);
      const token = user.access_token;
      
      return {
        isAuthenticated: !!token,
        token: token,
        user: user
      };
    } catch (error) {
      console.error('Error parsing user data:', error);
      return {
        isAuthenticated: false,
        token: null,
        user: null
      };
    }
  }

  // Log API error details
  logApiError(error: any, endpoint: string): void {
    console.group(`🚨 API Error - ${endpoint}`);
    console.log('Error Status:', error.status);
    console.log('Error Message:', error.message);
    console.log('Error URL:', error.url);
    console.log('Error Details:', error.error);
    
    const authStatus = this.checkAuthStatus();
    console.log('Auth Status:', authStatus);
    
    if (!authStatus.isAuthenticated) {
      console.warn('❌ User is not authenticated - this might be the cause of the error');
    } else {
      console.log('✅ User is authenticated with token:', authStatus.token?.substring(0, 20) + '...');
    }
    
    console.groupEnd();
  }

  // Get mock response for failed API calls
  getMockResponse(endpoint: string): any {
    const mockResponses: {[key: string]: any} = {
      'quiz/start': {
        success: false,
        message: 'Quiz functionality requires authentication. Please log in to start quizzes.',
        mock_data: {
          session_id: 'mock_session_' + Date.now(),
          quiz_id: 1,
          questions: [],
          time_limit: 30
        }
      },
      'exam/start': {
        success: false,
        message: 'Exam functionality requires authentication. Please log in to start exams.',
        mock_data: {
          session_id: 'mock_session_' + Date.now(),
          exam_id: 1,
          questions: [],
          time_limit: 60
        }
      }
    };

    return mockResponses[endpoint] || {
      success: false,
      message: 'This feature requires authentication. Please log in to continue.',
      mock_data: null
    };
  }

  // Show user-friendly error message
  getErrorMessage(error: any): string {
    const authStatus = this.checkAuthStatus();
    
    if (error.status === 401) {
      return authStatus.isAuthenticated 
        ? 'Your session has expired. Please log in again.'
        : 'Please log in to access this feature.';
    }
    
    if (error.status === 400 && error.error?.message?.includes('route') && error.error?.message?.includes('not be found')) {
      return 'This feature is currently under development.';
    }
    
    if (error.status === 403) {
      return 'You do not have permission to access this feature.';
    }
    
    if (error.status === 500) {
      return 'Server error. Please try again later.';
    }
    
    return 'An error occurred. Please try again.';
  }
} 