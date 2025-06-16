import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Media upload endpoint
  uploadMedia(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('attachments[]', file);
    
    return this.http.post(`${this.apiUrl}/attachment`, formData).pipe(
      map((response: any) => {
        console.log('Raw upload response:', response);
        
        // Handle the response format from the attachment upload
        if (Array.isArray(response)) {
          // Response is directly an array of attachments
          return response.map(attachment => ({
            id: attachment.id,
            original_url: attachment.original_url || attachment.url,
            file_name: attachment.file_name,
            name: attachment.name
          }));
        } else if (response && Array.isArray(response.data)) {
          // Response has data property with array
          return response.data.map((attachment: any) => ({
            id: attachment.id,
            original_url: attachment.original_url || attachment.url,
            file_name: attachment.file_name,
            name: attachment.name
          }));
        } else if (response && response.id) {
          // Single attachment response
          return [{
            id: response.id,
            original_url: response.original_url || response.url,
            file_name: response.file_name,
            name: response.name
          }];
        }
        
        console.error('Unexpected upload response format:', response);
        throw new Error('Invalid upload response format');
      })
    );
  }

  // Course cover upload endpoint (dedicated for course covers)
  uploadCourseCover(file: File): Observable<any> {
    console.log('🌐 API Service - uploadCourseCover called');
    console.log('📁 File being uploaded:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    const formData = new FormData();
    formData.append('cover_image', file);
    
    console.log('📤 Making POST request to:', `${this.apiUrl}/course/upload-cover`);
    console.log('📋 FormData contents:', formData.get('cover_image'));
    
    return this.http.post(`${this.apiUrl}/course/upload-cover`, formData).pipe(
      map((response: any) => {
        console.log('✅ API Service - Upload response received:', response);
        return response;
      }),
      catchError((error: any) => {
        console.error('❌ API Service - Upload error:', error);
        throw error;
      })
    );
  }

  // Simplified course cover upload endpoint (saves path directly)
  uploadCourseCoverSimple(file: File): Observable<any> {
    console.log('🌐 API Service - uploadCourseCoverSimple called');
    console.log('📁 File being uploaded:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    const formData = new FormData();
    formData.append('cover_image', file);
    
    console.log('📤 Making POST request to:', `${this.apiUrl}/course/upload-cover-simple`);
    
    return this.http.post(`${this.apiUrl}/course/upload-cover-simple`, formData).pipe(
      map((response: any) => {
        console.log('✅ API Service - Simplified upload response received:', response);
        
        // Use the correct API server URL for image proxy
        if (response && response.cover_image_path && response.file_name) {
          // Extract the base URL from the API URL (remove /admin/api part)
          const apiBaseUrl = this.apiUrl.replace('/admin/api', '');
          response.full_url = `${apiBaseUrl}/admin/api/image-proxy/course-covers/${response.file_name}`;
          response.proxy_url = response.full_url;
          console.log('🔄 Enhanced response with correct proxy URL:', response.full_url);
        }
        
        return response;
      }),
      catchError((error: any) => {
        console.error('❌ API Service - Simplified upload error:', error);
        
        // Enhanced error logging
        if (error.error && error.error.message) {
          console.error('Server error message:', error.error.message);
        }
        
        throw error;
      })
    );
  }

  // Teacher endpoints
  getTeacherCourses(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/teacher-courses/${userId}`);
  }

  getTeacherDashboardData(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard-teacher/${userId}`);
  }

  // Student endpoints
  getStudentCourses(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/current-courses/${userId}`);
  }

  getStudentDashboardData(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard-student/${userId}`);
  }

  getDashboardUserData(userId: number): Observable<any> {
    // Use the comprehensive dashboard-user endpoint that provides all student data
    return this.http.get(`${this.apiUrl}/dashboard-user/${userId}`);
  }

  // Course management endpoints
  createCompleteCourse(courseData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/teacher/course/create-complete`, courseData);
  }

  // Simplified course creation endpoint (uses direct cover_image field)
  createCourseSimple(courseData: any): Observable<any> {
    console.log('🌐 API Service - createCourseSimple called with data:', courseData);
    return this.http.post(`${this.apiUrl}/teacher/course/create-simple`, courseData).pipe(
      map((response: any) => {
        console.log('✅ API Service - Simplified course creation response:', response);
        return response;
      }),
      catchError((error: any) => {
        console.error('❌ API Service - Simplified course creation error:', error);
        throw error;
      })
    );
  }

  // Test Angular-Laravel connection
  testAngularConnection(testData: any = {}): Observable<any> {
    console.log('🌐 API Service - testAngularConnection called with data:', testData);
    return this.http.post(`${this.apiUrl}/test/angular-connection`, testData).pipe(
      map((response: any) => {
        console.log('✅ API Service - Angular connection test response:', response);
        return response;
      }),
      catchError((error: any) => {
        console.error('❌ API Service - Angular connection test error:', error);
        throw error;
      })
    );
  }

  addChapterToCourse(courseId: number, chapterData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/teacher/course/${courseId}/chapter`, chapterData);
  }

  addExamToCourse(courseId: number, examData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/teacher/course/${courseId}/exam`, examData);
  }

  addQuizToCourse(courseId: number, quizData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/teacher/course/${courseId}/quiz`, quizData);
  }

  getCourseDetails(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/teacher/course/${courseId}/details`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/category`);
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

  // Chapter Management
  getCourseChapters(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/teacher/course/${courseId}/chapters`);
  }

  createChapter(courseId: number, chapterData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/teacher/course/${courseId}/chapter`, chapterData);
  }

  updateChapter(chapterId: number, chapterData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/teacher/chapter/${chapterId}`, chapterData);
  }

  deleteChapter(chapterId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/teacher/chapter/${chapterId}`);
  }

  // Content Management
  deleteContent(contentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/teacher/content/${contentId}`);
  }

  // Quiz Management
  getCourseQuizzes(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/teacher/course/${courseId}/quizzes`);
  }

  createQuiz(courseId: number, quizData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/teacher/course/${courseId}/quiz`, quizData);
  }

  updateQuiz(quizId: number, quizData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/teacher/quiz/${quizId}`, quizData);
  }

  deleteQuiz(quizId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/teacher/quiz/${quizId}`);
  }

  // Exam Management
  getCourseExams(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/teacher/course/${courseId}/exams`);
  }

  createExam(courseId: number, examData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/teacher/course/${courseId}/exam`, examData);
  }

  updateExam(examId: number, examData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/teacher/exam/${examId}`, examData);
  }

  deleteExam(examId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/teacher/exam/${examId}`);
  }

  // Quiz Session Management (Student)
  startQuizSession(quizId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/quiz/start`, { quiz_id: quizId });
  }

  submitQuizSession(sessionId: number, answers: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/quiz/session/${sessionId}/submit`, { answers });
  }

  getQuizResults(sessionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/quiz/session/${sessionId}/results`);
  }

  getUserQuizSessions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/quiz/sessions`);
  }

  // Exam Session Management (Student)
  startExamSession(examId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/exam/start`, { exam_id: examId });
  }

  submitExamSession(sessionId: number, answers: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/exam/session/${sessionId}/submit`, { answers });
  }

  getExamResults(sessionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/exam/session/${sessionId}/results`);
  }

  getUserExamSessions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/exam/sessions`);
  }

  // Get quiz/exam details for students
  getQuizDetails(quizId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/quiz/${quizId}`);
  }

  getExamDetails(examId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/examen/${examId}`);
  }

  // Debug method to check user enrollments
  debugUserEnrollments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/debug/enrollments`);
  }

  // Debug method to start quiz session without enrollment check
  debugStartQuizSession(quizId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/debug/quiz/start`, { quiz_id: quizId });
  }
}