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
    
    // Load teacher courses
    this.apiService.getTeacherCourses(this.user.id).subscribe({
      next: (courses: CourseData[]) => {
        this.courses = courses;
        
        // Calculate dashboard metrics from courses data
        if (courses && courses.length) {
          this.teacherData.activeCourses = courses.length;
          
          // Calculate total students across all courses
          let totalStudents = 0;
          let totalRevenue = 0;
          
          const recentCourses: RecentCourse[] = [];
          
          courses.forEach((course: CourseData) => {
            if (course.enrollments) {
              totalStudents += course.enrollments.length;
              
              // Calculate revenue from enrollments
              course.enrollments.forEach((enrollment: EnrollmentData) => {
                totalRevenue += enrollment.course_price || 0;
              });
            }
            
            // Add to recent courses list
            recentCourses.push({
              title: course.title,
              students: course.enrollments ? course.enrollments.length : 0,
              completion: this.calculateAverageCompletion(course.enrollments || []),
              category: course.category ? course.category.name : 'Uncategorized',
              image: course.media && course.media.length ? course.media[0].url : 'assets/img/placeholder.png',
              createdAt: new Date(course.created_at || new Date())
            });
          });
          
          this.teacherData.totalStudents = totalStudents;
          this.teacherData.totalRevenue = totalRevenue;
          this.teacherData.recentCourses = recentCourses;
          
          // Load more detailed dashboard data
          this.loadDashboardDetails();
        } else {
          this.setFallbackData();
        }
      },
      error: (err) => {
        console.error('Error loading teacher courses:', err);
        this.error = 'Failed to load courses data. Using demo data instead.';
        this.setFallbackData();
        this.isLoading = false;
      }
    });
  }
  
  loadDashboardDetails() {
    // Get additional dashboard data
    this.apiService.getDashboardUserData(this.user.id).subscribe({
      next: (data: any) => {
        if (data) {
          // Update dashboard with any additional data
          this.teacherData.completedCourses = data.completedCoursesCount || 0;
          
          // Process student progress data if available
          if (data.enrollments && data.enrollments.length) {
            const studentProgress: StudentProgress[] = [];
            
            // Process the first 5 enrollments to show student progress
            data.enrollments.slice(0, 5).forEach((enrollment: EnrollmentData) => {
              if (enrollment.course && enrollment.user) {
                studentProgress.push({
                  name: enrollment.user.name || 'Student',
                  course: enrollment.course.title || 'Course',
                  progress: enrollment.progress || 0,
                  avatar: enrollment.user.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'
                });
              }
            });
            
            this.teacherData.studentProgress = studentProgress.length ? studentProgress : this.teacherData.studentProgress;
          }
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard details:', err);
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