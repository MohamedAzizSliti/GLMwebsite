import { Component, OnInit } from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import { GlobalService } from '../../../services/global.service';
import { ApiService } from '../../../services/api.service';

interface CourseData {
  id?: number;
  title: string;
  description?: string;
  price?: number;
  duration?: number;
  thumbnail?: string;
  category?: any;
  instructor?: any;
  media?: any[];
  enrollments?: EnrollmentData[];
  exams?: any[];
  created_at?: string;
}

interface EnrollmentData {
  id?: number;
  user_id: number;
  course_id: number;
  status?: string;
  progress: number;
  course_price?: number;
  user?: any;
  course?: CourseData;
}

interface StudentProgress {
  name: string;
  course: string;
  progress: number;
  avatar: string;
}

interface RecentCourse {
  title: string;
  students: number;
  completion: number;
  category: string;
  image: string;
  createdAt: Date;
}

@Component({
  selector: 'app-teacher-dashboard',
  standalone: false,
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.scss'
})
export class TeacherDashboardComponent implements OnInit {
  routes = routes;
  user: any;
  isLoading = true;
  error: string | null = null;

  // Teacher data from API
  teacherData: any = {
    totalStudents: 0,
    activeCourses: 0,
    completedCourses: 0,
    totalRevenue: 0,
    studentProgress: [] as StudentProgress[],
    recentCourses: [] as RecentCourse[],
    courseProgress: []
  };
  
  // Course data from API
  courses: CourseData[] = [];

  constructor(
    private globalService: GlobalService,
    private apiService: ApiService
  ) {
    this.user = this.globalService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadTeacherData();
  }
  
  loadTeacherData() {
    if (!this.user || !this.user.id) {
      this.setFallbackData();
      return;
    }

    this.isLoading = true;

    // Load teacher dashboard data directly from new endpoint
    this.apiService.getTeacherDashboardData(this.user.id).subscribe({
      next: (dashboardData: any) => {
        console.log('Teacher dashboard data:', dashboardData);

        if (dashboardData) {
          this.teacherData = {
            totalStudents: dashboardData.totalStudents || 0,
            activeCourses: dashboardData.activeCourses || 0,
            completedCourses: dashboardData.completedCourses || 0,
            totalRevenue: dashboardData.totalRevenue || 0,
            studentProgress: dashboardData.studentProgress || [],
            courseProgress: dashboardData.courseProgress || [],
            recentCourses: []
          };

          // Also load teacher courses for additional details
          this.loadTeacherCourses();
        } else {
          this.setFallbackData();
        }
      },
      error: (err) => {
        console.error('Error loading teacher dashboard data:', err);
        this.error = 'Failed to load dashboard data. Using demo data instead.';
        this.setFallbackData();
        this.isLoading = false;
      }
    });
  }

  loadTeacherCourses() {
    // Load teacher courses for additional course details
    this.apiService.getTeacherCourses(this.user.id).subscribe({
      next: (courses: CourseData[]) => {
        this.courses = courses;
        console.log('Teacher courses:', courses);

        // Process courses for recent courses display
        if (courses && courses.length) {
          const recentCourses: RecentCourse[] = [];

          courses.forEach((course: CourseData) => {
            recentCourses.push({
              title: course.title,
              students: course.enrollments ? course.enrollments.length : 0,
              completion: this.calculateAverageCompletion(course.enrollments || []),
              category: course.category ? course.category.name : 'Uncategorized',
              image: course.media && course.media.length ? course.media[0].url : 'assets/img/placeholder.png',
              createdAt: new Date(course.created_at || new Date())
            });
          });

          this.teacherData.recentCourses = recentCourses;
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading teacher courses:', err);
        this.isLoading = false;
      }
    });
  }
  

  
  calculateAverageCompletion(enrollments: EnrollmentData[]): number {
    if (!enrollments || enrollments.length === 0) return 0;
    
    const totalProgress = enrollments.reduce((sum, enrollment) => sum + (enrollment.progress || 0), 0);
    return Math.round(totalProgress / enrollments.length);
  }

  setFallbackData() {
    // Fallback to demo data if API fails
    this.teacherData = {
      totalStudents: 156,
      activeCourses: 8,
      completedCourses: 12,
      totalRevenue: 2450,
      studentProgress: [
        { name: 'Ahmed Ben Ali', course: 'HTML/CSS Avancé', progress: 85, avatar: 'assets/img/avatar-placeholder.jpg' },
        { name: 'Fatima Zahra', course: 'JavaScript ES6', progress: 92, avatar: 'assets/img/avatar-placeholder.jpg' },
        { name: 'Mohamed Slim', course: 'React Fundamentals', progress: 67, avatar: 'assets/img/avatar-placeholder.jpg' },
        { name: 'Amina Khelil', course: 'Node.js Backend', progress: 78, avatar: 'assets/img/avatar-placeholder.jpg' },
        { name: 'Youssef Mansour', course: 'Database Design', progress: 94, avatar: 'assets/img/avatar-placeholder.jpg' }
      ],
      recentCourses: [
        { 
          title: 'HTML/CSS Avancé', 
          students: 45, 
          completion: 78, 
          category: 'Programmation',
          image: 'assets/img/course-placeholder.jpg',
          createdAt: new Date('2024-01-15')
        },
        { 
          title: 'JavaScript ES6', 
          students: 38, 
          completion: 85, 
          category: 'Programmation',
          image: 'assets/img/course-placeholder.jpg',
          createdAt: new Date('2024-02-10')
        },
        { 
          title: 'React Fundamentals', 
          students: 29, 
          completion: 62, 
          category: 'Programmation',
          image: 'assets/img/course-placeholder.jpg',
          createdAt: new Date('2024-03-05')
        }
      ],
      courseProgress: [
        { course: 'HTML/CSS Avancé', totalStudents: 45, completed: 35, inProgress: 8, notStarted: 2 },
        { course: 'JavaScript ES6', totalStudents: 38, completed: 32, inProgress: 5, notStarted: 1 },
        { course: 'React Fundamentals', totalStudents: 29, completed: 18, inProgress: 9, notStarted: 2 }
      ]
    };
    this.isLoading = false;
  }
} 