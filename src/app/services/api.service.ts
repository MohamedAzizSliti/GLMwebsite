import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Teacher endpoints
  getTeacherCourses(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/current-courses/${userId}`);
  }

  getDashboardUserData(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard-user/${userId}`);
  }

  // Student endpoints
  getStudentEnrollments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/enrollments`);
  }

  getCourseProgress(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/course/${courseId}/progress`);
  }

  updateEnrollmentProgress(enrollmentId: number, progress: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/enrolement/progress/update`, {
      enrollmentId: enrollmentId,
      progress: progress
    });
  }

  // General endpoints
  getCourseDetails(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/course/${courseId}`);
  }
} 