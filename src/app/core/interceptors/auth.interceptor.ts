import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Check if this is a Gemini API call - don't add auth headers or handle 401s
    const isGeminiApiCall = req.url.includes('generativelanguage.googleapis.com');
    
    if (isGeminiApiCall) {
      console.log('Auth Interceptor - Gemini API call detected, skipping auth handling');
      // For Gemini API calls, just pass through without auth handling
      return next.handle(req);
    }

    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    let token = null;

    console.log('Auth Interceptor - userData from localStorage:', userData);

    if (userData) {
      try {
        const user = JSON.parse(userData);
        token = user.access_token;
        console.log('Auth Interceptor - extracted token:', token);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }

    // Clone the request and add authorization header if token exists
    if (token) {
      // Check if this is a file upload request (FormData)
      const isFileUpload = req.body instanceof FormData;

      const headers: any = {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json'
      };

      // Don't set Content-Type for file uploads, let the browser set it with boundary
      if (!isFileUpload) {
        headers['Content-Type'] = 'application/json';
      }

      req = req.clone({
        setHeaders: headers
      });
      console.log('Auth Interceptor - Request headers added:', req.headers.get('Authorization'));
      console.log('Auth Interceptor - Is file upload:', isFileUpload);
    } else {
      console.log('Auth Interceptor - No token found, request sent without auth');
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Only handle 401 errors for non-Gemini API calls
        if (error.status === 401 && !isGeminiApiCall) {
          // Token expired or invalid, redirect to login
          console.log('Auth Interceptor - 401 error for app API, redirecting to login');
          localStorage.removeItem('user');
          this.router.navigate(['/auth/login']);
        } else if (error.status === 401 && isGeminiApiCall) {
          console.log('Auth Interceptor - 401 error for Gemini API, not redirecting');
        }
        return throwError(() => error);
      })
    );
  }
}
