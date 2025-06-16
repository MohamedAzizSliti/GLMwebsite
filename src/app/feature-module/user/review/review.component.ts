import { Component } from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import {AccessDataService} from "../../../services/access-data.service";
import {NgxSpinnerService} from "ngx-spinner";
import {GlobalService} from "../../../services/global.service";

@Component({
  selector: 'app-review',
  standalone: false,
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {
  routes = routes;
  courses: any = [];

  // View management
  viewMode: 'list' | 'manage' = 'list';

  // Course management
  selectedCourseId: string = '';
  selectedCourse: any = null;
  isLoading: boolean = false;

  constructor(
    private accessDataService: AccessDataService,
    private ngxSpinner: NgxSpinnerService,
    private globaleService: GlobalService
  ) {
    console.log('ReviewComponent constructor called');
    console.log('Current user:', this.globaleService.getCurrentUser());
    this.loadTeacherCourses();
  }

  loadTeacherCourses() {
    this.ngxSpinner.show();
    const userId = this.globaleService.getCurrentUser().id;

    console.log('Current user ID:', userId);
    console.log('Loading courses for teacher:', userId);

    // Use the teacher-courses endpoint directly
    this.accessDataService.getData(null, 'teacher-courses/' + userId).subscribe({
      next: (response: any) => {
        this.courses = response;
        console.log('Teacher courses loaded:', this.courses);
        console.log('Number of courses:', this.courses.length);
        console.log('Raw response:', response);

        // Debug each course
        this.courses.forEach((course: any, index: number) => {
          console.log(`Course ${index + 1}:`, {
            id: course.id,
            title: course.title,
            user_id: course.user_id,
            category: course.category,
            chapters: course.chapters,
            exams: course.exams
          });
        });

        // Force change detection
        setTimeout(() => {
          console.log('Courses after timeout:', this.courses);
        }, 100);
      },
      error: (error) => {
        console.error('Error loading teacher courses:', error);
        this.ngxSpinner.hide();
      },
      complete: () => {
        this.ngxSpinner.hide();
      }
    });
  }

  // View management methods
  setViewMode(mode: 'list' | 'manage') {
    this.viewMode = mode;
    console.log('View mode changed to:', mode);
  }

  // Course management methods
  manageCourse(course: any) {
    this.selectedCourse = course;
    this.selectedCourseId = course.id.toString();
    this.setViewMode('manage');
    console.log('Managing course:', course);
  }

  onCourseSelect() {
    if (this.selectedCourseId) {
      this.selectedCourse = this.courses.find((course: any) => course.id.toString() === this.selectedCourseId);
      console.log('Selected course:', this.selectedCourse);
    } else {
      this.selectedCourse = null;
    }
  }

  loadCourses() {
    this.loadTeacherCourses();
  }

  // Event handlers for child components
  onChaptersUpdated(chapters: any[]) {
    if (this.selectedCourse) {
      this.selectedCourse.chapters = chapters;
      // Update the course in the courses array
      const courseIndex = this.courses.findIndex((c: any) => c.id === this.selectedCourse.id);
      if (courseIndex !== -1) {
        this.courses[courseIndex].chapters = chapters;
      }
    }
    console.log('Chapters updated:', chapters);
  }

  onQuizzesUpdated(quizzes: any[]) {
    if (this.selectedCourse) {
      this.selectedCourse.quizzes = quizzes;
      // Update the course in the courses array
      const courseIndex = this.courses.findIndex((c: any) => c.id === this.selectedCourse.id);
      if (courseIndex !== -1) {
        this.courses[courseIndex].quizzes = quizzes;
      }
    }
    console.log('Quizzes updated:', quizzes);
  }

  onExamsUpdated(exams: any[]) {
    if (this.selectedCourse) {
      this.selectedCourse.exams = exams;
      // Update the course in the courses array
      const courseIndex = this.courses.findIndex((c: any) => c.id === this.selectedCourse.id);
      if (courseIndex !== -1) {
        this.courses[courseIndex].exams = exams;
      }
    }
    console.log('Exams updated:', exams);
  }

  onCourseUpdated(course: any) {
    if (this.selectedCourse) {
      this.selectedCourse = { ...this.selectedCourse, ...course };
      // Update the course in the courses array
      const courseIndex = this.courses.findIndex((c: any) => c.id === this.selectedCourse.id);
      if (courseIndex !== -1) {
        this.courses[courseIndex] = { ...this.courses[courseIndex], ...course };
      }
    }
    console.log('Course updated:', course);
  }


}
