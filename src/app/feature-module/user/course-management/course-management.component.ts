import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { ChapterManagementComponent } from './chapter-management/chapter-management.component';
import { QuizManagementComponent } from './quiz-management/quiz-management.component';
import { ExamManagementComponent } from './exam-management/exam-management.component';
import { CourseSettingsComponent } from './course-settings/course-settings.component';

import { routes } from '../../../shared/routes/routes';
import { GlobalService } from '../../../services/global.service';
import { AccessDataService } from '../../../services/access-data.service';
import { ApiService } from '../../../services/api.service';

interface Course {
  id: number;
  title: string;
  description?: string;
  price?: number;
  level?: string;
  language?: string;
  total_duration?: number;
  category?: any;
  instructor?: any;
  chapters?: Chapter[];
  quizzes?: Quiz[];
  exams?: Exam[];
  created_at?: string;
  updated_at?: string;
}

interface Chapter {
  id: number;
  title: string;
  description?: string;
  order: number;
  is_published: boolean;
  is_free: boolean;
  contents?: Content[];
}

interface Content {
  id: number;
  title: string;
  type: string;
  duration: number;
  serial_number: number;
  is_free: boolean;
  media_link?: string;
}

interface Quiz {
  id: number;
  title: string;
  description?: string;
  duration: number;
  total_marks: number;
  passing_marks: number;
  is_published: boolean;
  questions?: Question[];
}

interface Exam {
  id: number;
  title: string;
  description?: string;
  duration: number;
  total_marks: number;
  passing_marks: number;
  is_published: boolean;
  questions?: Question[];
}

interface Question {
  id: number;
  question: string;
  type: string;
  options?: string[];
  correct_answer: string;
  marks: number;
  order: number;
}

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ChapterManagementComponent, QuizManagementComponent, ExamManagementComponent, CourseSettingsComponent],
  templateUrl: './course-management.component.html',
  styleUrls: ['./course-management.component.scss']
})
export class CourseManagementComponent implements OnInit {
  routes = routes;
  courses: Course[] = [];
  selectedCourse: Course | null = null;
  selectedCourseId: string = '';
  isLoading = false;
  user: any;

  constructor(
    private globalService: GlobalService,
    private accessDataService: AccessDataService,
    private apiService: ApiService,
    private ngxSpinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.globalService.getCurrentUser();
    this.loadCourses();

    // Debug routes
    console.log('Routes debug:', {
      teacherDashboard: routes.teacherDashboard,
      review: routes.review,
      courseManagement: routes.courseManagement,
      addCourse: routes.addCourse,
      certificationManagement: routes.certificationManagement,
      myProfile: routes.myProfile
    });
  }

  loadCourses() {
    this.isLoading = true;
    const userId = this.globalService.getCurrentUser().id;

    this.accessDataService.getData(null, 'teacher-courses/' + userId).subscribe({
      next: (response: Course[]) => {
        this.courses = response;
        console.log('Courses loaded:', this.courses);
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.showError('Erreur lors du chargement des cours');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onCourseSelect() {
    if (this.selectedCourseId) {
      this.loadCourseDetails(parseInt(this.selectedCourseId));
    } else {
      this.selectedCourse = null;
    }
  }

  loadCourseDetails(courseId: number) {
    this.isLoading = true;
    
    // Find course in loaded courses first
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      this.selectedCourse = course;
    }

    // Load detailed course information with chapters, quizzes, exams
    this.accessDataService.getData(null, `teacher/course/${courseId}/details`).subscribe({
      next: (response: any) => {
        this.selectedCourse = response.course;
        console.log('Course details loaded:', this.selectedCourse);
      },
      error: (error) => {
        console.error('Error loading course details:', error);
        // Fallback to basic course info if detailed loading fails
        if (course) {
          this.selectedCourse = course;
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onChaptersUpdated(chapters: Chapter[]) {
    if (this.selectedCourse) {
      this.selectedCourse.chapters = chapters;
      this.updateCourseStats();
    }
  }

  onQuizzesUpdated(quizzes: Quiz[]) {
    if (this.selectedCourse) {
      this.selectedCourse.quizzes = quizzes;
      console.log('Quizzes updated in course:', quizzes);
      
      // Optionally reload course details to ensure data consistency
      // This can be uncommented if you want to always sync with server
      // this.loadCourseDetails(this.selectedCourse.id);
    }
  }

  onExamsUpdated(exams: Exam[]) {
    if (this.selectedCourse) {
      this.selectedCourse.exams = exams;
    }
  }

  onCourseUpdated(course: Course) {
    this.selectedCourse = course;
    // Update in courses list
    const index = this.courses.findIndex(c => c.id === course.id);
    if (index !== -1) {
      this.courses[index] = course;
    }
  }

  private updateCourseStats() {
    if (this.selectedCourse && this.selectedCourse.chapters) {
      // Calculate total duration from chapters
      let totalDuration = 0;
      this.selectedCourse.chapters.forEach(chapter => {
        if (chapter.contents) {
          chapter.contents.forEach(content => {
            totalDuration += content.duration || 0;
          });
        }
      });
      this.selectedCourse.total_duration = totalDuration;
    }
  }

  logout() {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');

    // Navigate to login page
    this.router.navigate([routes.login]);
  }

  private showError(message: string) {
    // You can implement a toast notification service here
    console.error(message);
  }

  private showSuccess(message: string) {
    // You can implement a toast notification service here
    console.log(message);
  }
}
